"use server"
import { z } from "zod"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { and, eq } from "drizzle-orm"

import validate from "~/util/validate"
import { getAuthOrThrow } from "~/auth/jwt"
import db from "~/database/db"
import { game, question } from "~/database/schema"
import DemocraticPrimaryDialogue, {
	DEMOCRATIC_PRIMARY_QUESTION_COUNT,
} from "~/dialogue/DemocraticPrimary"
import RepublicanPrimaryDialogue, {
	REPUBLICAN_PRIMARY_QUESTION_COUNT,
} from "~/dialogue/RepublicanPrimary"
import GeneralDialogue, { GENERAL_QUESTION_COUNT } from "~/dialogue/General"
import ratePrimaryDebate from "~/ai/ratePrimaryDebate"
import rateGeneralDebate from "~/ai/rateGeneralDebate"

// assumes that neither election begins or ends with a question

const continueDialogueAction = validate(
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
				db
					.update(game)
					.set({
						[{
							Primary: "primaryDialogueId",
							General: "generalDialogueId",
						}[stage]]: dialogueId + 1,
					})
					.where(eq(game.id, gameId)),
				{
					Primary: (async () =>
						await Promise.all([
							DemocraticPrimaryDialogue.find(
								({ id }) => id === dialogueId + 1
							)?.question &&
								db
									.insert(question)
									.values({
										gameId,
										election: "DemocraticPrimary",
										dialogueId: dialogueId + 1,
										presentedAt: new Date(),
									})
									.onConflictDoNothing(),
							RepublicanPrimaryDialogue.find(
								({ id }) => id === dialogueId + 1
							)?.question &&
								db
									.insert(question)
									.values({
										gameId,
										election: "RepublicanPrimary",
										dialogueId: dialogueId + 1,
										presentedAt: new Date(),
									})
									.onConflictDoNothing(),
						]))(),
					General: (async () =>
						GeneralDialogue.find(({ id }) => id === dialogueId + 1)
							?.question &&
						(await db
							.insert(question)
							.values({
								gameId,
								election: "General",
								dialogueId: dialogueId + 1,
								presentedAt: new Date(),
							})
							.onConflictDoNothing()))(),
				}[stage],
			])
		} else if (stage === "Primary") {
			await db
				.update(game)
				.set({
					generalDialogueId: 1,
				})
				.where(eq(game.id, gameId))
		} else if (stage === "General") {
			await db
				.update(game)
				.set({
					finished: true,
				})
				.where(eq(game.id, gameId))
		}

		revalidatePath(`/game/${gameId}`)
	} else {
		if (stage === "Primary") {
			const dialogue = {
				Democratic: DemocraticPrimaryDialogue.find(
					({ id }) => id === dialogueId
				),
				Republican: RepublicanPrimaryDialogue.find(
					({ id }) => id === dialogueId
				),
			}

			const responses = await db.transaction(async (tx) => {
				const [[questionRow], [otherQuestionRow]] = await Promise.all([
					tx
						.update(question)
						.set({
							[isIncumbent
								? "incumbentResponse"
								: "newcomerResponse"]: response,
						})
						.where(
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
								),
								eq(question.dialogueId, dialogueId)
							)
						)
						.returning()
						.all(),
					tx
						.select()
						.from(question)
						.where(
							and(
								eq(question.gameId, gameId),
								eq(
									question.election,
									{
										Democratic:
											"RepublicanPrimary" as const,
										Republican:
											"DemocraticPrimary" as const,
									}[party]
								),
								eq(question.dialogueId, dialogueId)
							)
						),
				])

				return {
					DemocraticIncumbent:
						{
							Democratic: questionRow?.incumbentResponse,
							Republican: otherQuestionRow?.incumbentResponse,
						}[party] ?? undefined,
					DemocraticNewcomer:
						{
							Democratic: questionRow?.newcomerResponse,
							Republican: otherQuestionRow?.newcomerResponse,
						}[party] ?? undefined,
					RepublicanIncumbent:
						{
							Democratic: otherQuestionRow?.incumbentResponse,
							Republican: questionRow?.incumbentResponse,
						}[party] ?? undefined,
					RepublicanNewcomer:
						{
							Democratic: otherQuestionRow?.newcomerResponse,
							Republican: questionRow?.newcomerResponse,
						}[party] ?? undefined,
				}
			})

			if (
				responses.DemocraticIncumbent === undefined ||
				responses.DemocraticNewcomer === undefined ||
				responses.RepublicanIncumbent === undefined ||
				responses.RepublicanNewcomer === undefined
			)
				return

			const [democraticAIResponse, republicanAIResponse] =
				await Promise.all([
					ratePrimaryDebate({
						party: "Democratic",
						question:
							dialogue.Democratic !== undefined &&
							"content" in dialogue.Democratic
								? dialogue.Democratic.content
								: "",
						state: dialogue.Democratic?.state ?? "",
						responses: {
							Incumbent: responses.DemocraticIncumbent,
							Newcomer: responses.DemocraticNewcomer,
						},
					}),
					ratePrimaryDebate({
						party: "Republican",
						question:
							dialogue.Republican !== undefined &&
							"content" in dialogue.Republican
								? dialogue.Republican.content
								: "",
						state: dialogue.Republican?.state ?? "",
						responses: {
							Incumbent: responses.RepublicanIncumbent,
							Newcomer: responses.RepublicanNewcomer,
						},
					}),
				])

			const ratings = {
				DemocraticIncumbent: democraticAIResponse.ratings.Incumbent,
				DemocraticNewcomer: democraticAIResponse.ratings.Newcomer,
				RepublicanIncumbent: republicanAIResponse.ratings.Incumbent,
				RepublicanNewcomer: republicanAIResponse.ratings.Newcomer,
			}

			const portions = {
				DemocraticIncumbent:
					ratings.DemocraticIncumbent /
					(ratings.DemocraticIncumbent + ratings.DemocraticNewcomer) /
					DEMOCRATIC_PRIMARY_QUESTION_COUNT,
				DemocraticNewcomer:
					ratings.DemocraticNewcomer /
					(ratings.DemocraticIncumbent + ratings.DemocraticNewcomer) /
					DEMOCRATIC_PRIMARY_QUESTION_COUNT,
				RepublicanIncumbent:
					ratings.RepublicanIncumbent /
					(ratings.RepublicanIncumbent + ratings.RepublicanNewcomer) /
					REPUBLICAN_PRIMARY_QUESTION_COUNT,
				RepublicanNewcomer:
					ratings.RepublicanNewcomer /
					(ratings.RepublicanIncumbent + ratings.RepublicanNewcomer) /
					REPUBLICAN_PRIMARY_QUESTION_COUNT,
			}

			await Promise.all([
				db
					.update(question)
					.set({
						incumbentPortion: portions.DemocraticIncumbent,
						newcomerPortion: portions.DemocraticNewcomer,
					})
					.where(
						and(
							eq(question.gameId, gameId),
							eq(question.election, "DemocraticPrimary"),
							eq(question.dialogueId, dialogueId)
						)
					),
				db
					.update(question)
					.set({
						incumbentPortion: portions.RepublicanIncumbent,
						newcomerPortion: portions.RepublicanNewcomer,
					})
					.where(
						and(
							eq(question.gameId, gameId),
							eq(question.election, "RepublicanPrimary"),
							eq(question.dialogueId, dialogueId)
						)
					),
				db
					.update(game)
					.set({
						primaryDialogueId: dialogueId + 1,
					})
					.where(eq(game.id, gameId)),
				DemocraticPrimaryDialogue.find(
					({ id }) => id === dialogueId + 1
				)?.question &&
					db
						.insert(question)
						.values({
							gameId,
							election: "DemocraticPrimary",
							dialogueId: dialogueId + 1,
							presentedAt: new Date(),
						})
						.onConflictDoNothing(),
				RepublicanPrimaryDialogue.find(
					({ id }) => id === dialogueId + 1
				)?.question &&
					db
						.insert(question)
						.values({
							gameId,
							election: "RepublicanPrimary",
							dialogueId: dialogueId + 1,
							presentedAt: new Date(),
						})
						.onConflictDoNothing(),
			])
		} else if (stage === "General") {
			const dialogue = GeneralDialogue.find(({ id }) => id === dialogueId)

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
						eq(question.gameId, gameId),
						eq(question.election, "General"),
						eq(question.dialogueId, dialogueId)
					)
				)
				.returning()
				.all()

			const responses = {
				Democratic: questionRow?.democraticResponse ?? undefined,
				Republican: questionRow?.republicanResponse ?? undefined,
			}

			if (
				responses.Democratic === undefined ||
				responses.Republican === undefined
			)
				return

			const generalAIResponse = await rateGeneralDebate({
				question:
					dialogue !== undefined && "content" in dialogue
						? dialogue.content
						: "",
				state: dialogue?.state ?? "",
				responses: {
					Democratic: responses.Democratic,
					Republican: responses.Republican,
				},
			})

			const ratings = {
				Democratic: generalAIResponse.ratings.Democratic,
				Republican: generalAIResponse.ratings.Republican,
			}

			const portions = {
				Democratic:
					ratings.Democratic /
					(ratings.Democratic + ratings.Republican) /
					GENERAL_QUESTION_COUNT,
				Republican:
					ratings.Republican /
					(ratings.Democratic + ratings.Republican) /
					GENERAL_QUESTION_COUNT,
			}

			await Promise.all([
				db
					.update(question)
					.set({
						democraticPortion: portions.Democratic,
						republicanPortion: portions.Republican,
					})
					.where(
						and(
							eq(question.gameId, gameId),
							eq(question.election, "General"),
							eq(question.dialogueId, dialogueId)
						)
					),
				db
					.update(game)
					.set({
						generalDialogueId: dialogueId + 1,
					})
					.where(eq(game.id, gameId)),
				GeneralDialogue.find(({ id }) => id === dialogueId + 1)
					?.question &&
					(await db
						.insert(question)
						.values({
							gameId,
							election: "General",
							dialogueId: dialogueId + 1,
							presentedAt: new Date(),
						})
						.onConflictDoNothing()),
			])
		}
	}
})

export default continueDialogueAction
