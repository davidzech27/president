"use server"
import { zact } from "zact/server"
import { z } from "zod"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { and, eq } from "drizzle-orm"

import { getAuthOrThrow } from "~/auth/jwt"
import db from "~/database/db"
import { game, question } from "~/database/schema"
import updateGame from "~/update/updateGame"
import DemocraticPrimaryDialogue, {
	DEMOCRATIC_PRIMARY_QUESTION_COUNT,
} from "~/dialogue/DemocraticPrimary"
import RepublicanPrimaryDialogue, {
	REPUBLICAN_PRIMARY_QUESTION_COUNT,
} from "~/dialogue/RepublicanPrimary"
import GeneralDialogue, { GENERAL_QUESTION_COUNT } from "~/dialogue/General"

// assumes that neither election begins or ends with a question

const continueDialogueAction = zact(
	z.object({
		gameId: z.string(),
		dialogueId: z.number(),
		stage: z.enum(["Primary", "General"]),
		response: z.string().optional(),
	})
)(async ({ gameId, dialogueId, stage, response }) => {
	noStore()

	const auth = await getAuthOrThrow({ cookies })

	if (auth.gameId !== gameId)
		throw new Error("Cannot continue dialogue for game that you are not in")

	const { role } = auth

	const isIncumbent = role.includes("Incumbent")

	const party = role.startsWith("Democratic") ? "Democratic" : "Republican"

	if (response === undefined) {
		const isNextDialogue =
			{
				Primary: DemocraticPrimaryDialogue.find(
					({ id }) => id === dialogueId + 1
				),
				General: GeneralDialogue.find(
					({ id }) => id === dialogueId + 1
				),
			}[stage] !== undefined

		if (isNextDialogue) {
			await Promise.all([
				db.update(game).set({
					[{
						Primary: "primaryDialogueId",
						General: "generalDialogueId",
					}[stage]]: dialogueId + 1,
				}),
				db
					.insert(question)
					.values({
						gameId,
						election: {
							Primary: {
								Democratic: "DemocraticPrimary" as const,
								Republican: "RepublicanPrimary" as const,
							}[party],
							General: "General" as const,
						}[stage],
						dialogueId: dialogueId + 1,
						presentedAt: new Date(),
					})
					.onConflictDoNothing(),
			])
		} else if (stage === "Primary") {
			await db.update(game).set({
				generalDialogueId: 1,
			})
		} else if (stage === "General") {
			await db.update(game).set({
				finished: true,
			})
		}

		revalidatePath(`/game/${gameId}`)
	} else {
		const dialogue = {
			Democratic: DemocraticPrimaryDialogue,
			Republican: RepublicanPrimaryDialogue,
		}[party].find(({ id }) => id === dialogueId)

		if (dialogue === undefined) throw new Error("Dialogue not found")

		if (stage === "Primary") {
			const [questionRow] = await db
				.update(question)
				.set({
					[isIncumbent ? "incumbentResponse" : "newcomerResponse"]:
						response,
				})
				.where(
					and(
						and(
							eq(question.gameId, gameId),
							eq(
								question.election,
								{
									Democratic: "DemocraticPrimary" as const,
									Republican: "RepublicanPrimary" as const,
								}[party]
							)
						),
						eq(question.dialogueId, dialogueId)
					)
				)
				.returning()
				.all()

			const otherResponse = isIncumbent
				? questionRow?.newcomerResponse
				: questionRow?.incumbentResponse

			console.log({ questionRow, party, response, otherResponse }) //!

			if (otherResponse === undefined) return

			const { incumbentRating, newcomerRating } = {
				incumbentRating: 5,
				newcomerRating: 7,
			}

			const incumbentPortion =
				incumbentRating /
				(incumbentRating + newcomerRating) /
				{
					Democratic: DEMOCRATIC_PRIMARY_QUESTION_COUNT,
					Republican: REPUBLICAN_PRIMARY_QUESTION_COUNT,
				}[party]

			const newcomerPortion =
				newcomerRating /
				(incumbentRating + newcomerRating) /
				{
					Democratic: DEMOCRATIC_PRIMARY_QUESTION_COUNT,
					Republican: REPUBLICAN_PRIMARY_QUESTION_COUNT,
				}[party]

			await Promise.all([
				db
					.update(question)
					.set({
						incumbentPortion,
						newcomerPortion,
					})
					.where(
						and(
							and(
								eq(question.gameId, gameId),
								eq(
									question.election,
									{
										Democratic:
											"DemocraticPrimary" as const,
										Republican:
											"RepublicanPrimary" as const,
									}[party]
								)
							),
							eq(question.dialogueId, dialogueId)
						)
					),
				db
					.update(game)
					.set({
						primaryDialogueId: dialogueId + 1,
					})
					.where(eq(question.gameId, gameId)),
				db
					.insert(question)
					.values({
						gameId,
						election: {
							Democratic: "DemocraticPrimary" as const,
							Republican: "RepublicanPrimary" as const,
						}[party],
						dialogueId: dialogueId + 1,
						presentedAt: new Date(),
					})
					.onConflictDoNothing(),
			])

			await updateGame({ gameId })
		} else if (stage === "General") {
			const [questionRow] = await db
				.update(question)
				.set({
					[{
						Democratic: "democraticResponse",
						Republican: "republicanResponse",
					}[party]]: response,
				})
				.where(
					and(
						and(
							eq(question.gameId, gameId),
							eq(question.election, "General")
						),
						eq(question.dialogueId, dialogueId)
					)
				)
				.returning()
				.all()

			const otherResponse = {
				Democratic: questionRow?.republicanResponse,
				Republican: questionRow?.democraticResponse,
			}[party]

			if (otherResponse === undefined) return

			const { democraticRating, republicanRating } = {
				democraticRating: 5,
				republicanRating: 7,
			}

			const democraticPortion =
				democraticRating /
				(democraticRating + republicanRating) /
				GENERAL_QUESTION_COUNT

			const republicanPortion =
				republicanRating /
				(democraticRating + republicanRating) /
				GENERAL_QUESTION_COUNT

			await Promise.all([
				db
					.update(question)
					.set({
						democraticPortion,
						republicanPortion,
					})
					.where(
						and(
							and(
								eq(question.gameId, gameId),
								eq(question.election, "General")
							),
							eq(question.dialogueId, dialogueId)
						)
					),
				db
					.update(game)
					.set({
						generalDialogueId: dialogueId + 1,
					})
					.where(eq(question.gameId, gameId)),
				db
					.insert(question)
					.values({
						gameId,
						election: "General",
						dialogueId: dialogueId + 1,
						presentedAt: new Date(),
					})
					.onConflictDoNothing(),
			])

			await updateGame({ gameId })
		}
	}
})

export default continueDialogueAction
