import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { z } from "zod"
import { asc, eq } from "drizzle-orm"

import { getAuth } from "~/auth/jwt"
import db from "~/database/db"
import { game, player, question } from "~/database/schema"
import Game from "./Game"

export const runtime = "edge"

const paramsSchema = z.object({
	gameId: z.string(),
})

export default async function GamePage({ params }: { params: unknown }) {
	const { gameId: gameIdEncoded } = paramsSchema.parse(params)

	const gameId = decodeURIComponent(gameIdEncoded)

	const auth = await getAuth({ cookies })

	if (auth === undefined || auth.gameId !== gameId) notFound()

	const [[gameRow], playerRows, questionRows] = await Promise.all([
		db
			.select({
				id: game.id,
				primaryDialogueId: game.primaryDialogueId,
				generalDialogueId: game.generalDialogueId,
				finished: game.finished,
			})
			.from(game)
			.where(eq(game.id, gameId)),
		db
			.select({ role: player.role, name: player.name })
			.from(player)
			.where(eq(player.gameId, gameId)),
		db
			.select({
				election: question.election,
				dialogueId: question.dialogueId,
				incumbentResponse: question.incumbentResponse,
				newcomerResponse: question.newcomerResponse,
				incumbentPortion: question.incumbentPortion,
				newcomerPortion: question.newcomerPortion,
				democraticResponse: question.democraticResponse,
				republicanResponse: question.republicanResponse,
				democraticPortion: question.democraticPortion,
				republicanPortion: question.republicanPortion,
				presentedAt: question.presentedAt,
			})
			.from(question)
			.where(eq(question.gameId, gameId))
			.orderBy(asc(question.presentedAt)),
	])

	if (gameRow === undefined) notFound()

	const democraticPrimaryQuestions = questionRows
		.filter(({ election }) => election === "DemocraticPrimary")
		.map((questionRow) => ({
			dialogueId: questionRow.dialogueId,
			incumbentResponse: questionRow.incumbentResponse ?? undefined,
			newcomerResponse: questionRow.newcomerResponse ?? undefined,
			incumbentPortion: questionRow.incumbentPortion ?? undefined,
			newcomerPortion: questionRow.newcomerPortion ?? undefined,
			presentedAt: questionRow.presentedAt,
		}))

	const republicanPrimaryQuestions = questionRows
		.filter(({ election }) => election === "RepublicanPrimary")
		.map((questionRow) => ({
			dialogueId: questionRow.dialogueId,
			incumbentResponse: questionRow.incumbentResponse ?? undefined,
			newcomerResponse: questionRow.newcomerResponse ?? undefined,
			incumbentPortion: questionRow.incumbentPortion ?? undefined,
			newcomerPortion: questionRow.newcomerPortion ?? undefined,
			presentedAt: questionRow.presentedAt,
		}))

	const generalQuestions = questionRows
		.filter(({ election }) => election === "General")
		.map((questionRow) => ({
			dialogueId: questionRow.dialogueId,
			democraticResponse: questionRow.democraticResponse ?? undefined,
			republicanResponse: questionRow.republicanResponse ?? undefined,
			democraticPortion: questionRow.democraticPortion ?? undefined,
			republicanPortion: questionRow.republicanPortion ?? undefined,
			presentedAt: questionRow.presentedAt,
		}))

	const players = {
		DemocraticIncumbent: playerRows.find(
			({ role }) => role === "DemocraticIncumbent"
		),
		DemocraticNewcomer: playerRows.find(
			({ role }) => role === "DemocraticNewcomer"
		),
		RepublicanIncumbent: playerRows.find(
			({ role }) => role === "RepublicanIncumbent"
		),
		RepublicanNewcomer: playerRows.find(
			({ role }) => role === "RepublicanNewcomer"
		),
	}

	const primaryPlayers = {
		DemocraticIncumbent: {
			name: players.DemocraticIncumbent?.name ?? "",
			portion: democraticPrimaryQuestions.reduce(
				(prevPortion, { incumbentPortion }) =>
					prevPortion + (incumbentPortion ?? 0),
				0
			),
		},
		DemocraticNewcomer: {
			name: players.DemocraticNewcomer?.name ?? "",
			portion: democraticPrimaryQuestions.reduce(
				(prevPortion, { newcomerPortion }) =>
					prevPortion + (newcomerPortion ?? 0),
				0
			),
		},
		RepublicanIncumbent: {
			name: players.RepublicanIncumbent?.name ?? "",
			portion: republicanPrimaryQuestions.reduce(
				(prevPortion, { incumbentPortion }) =>
					prevPortion + (incumbentPortion ?? 0),
				0
			),
		},
		RepublicanNewcomer: {
			name: players.RepublicanNewcomer?.name ?? "",
			portion: republicanPrimaryQuestions.reduce(
				(prevPortion, { newcomerPortion }) =>
					prevPortion + (newcomerPortion ?? 0),
				0
			),
		},
	}

	const generalPlayers = {
		DemocraticIncumbent: {
			name: primaryPlayers.DemocraticIncumbent.name,
			portion:
				primaryPlayers.DemocraticIncumbent.portion >=
				primaryPlayers.DemocraticNewcomer.portion
					? generalQuestions.reduce(
							(prevPortion, { democraticPortion }) =>
								prevPortion + (democraticPortion ?? 0),
							0
					  )
					: undefined,
		},
		DemocraticNewcomer: {
			name: primaryPlayers.DemocraticNewcomer.name,
			portion:
				primaryPlayers.DemocraticIncumbent.portion <
				primaryPlayers.DemocraticNewcomer.portion
					? generalQuestions.reduce(
							(prevPortion, { democraticPortion }) =>
								prevPortion + (democraticPortion ?? 0),
							0
					  )
					: undefined,
		},
		RepublicanIncumbent: {
			name: primaryPlayers.RepublicanIncumbent.name,
			portion:
				primaryPlayers.RepublicanIncumbent.portion >=
				primaryPlayers.RepublicanNewcomer.portion
					? generalQuestions.reduce(
							(prevPortion, { republicanPortion }) =>
								prevPortion + (republicanPortion ?? 0),
							0
					  )
					: undefined,
		},
		RepublicanNewcomer: {
			name: primaryPlayers.RepublicanNewcomer.name,
			portion:
				primaryPlayers.RepublicanIncumbent.portion <
				primaryPlayers.RepublicanNewcomer.portion
					? generalQuestions.reduce(
							(prevPortion, { republicanPortion }) =>
								prevPortion + (republicanPortion ?? 0),
							0
					  )
					: undefined,
		},
	}

	return (
		<Game
			gameId={gameId}
			role={auth.role}
			gameState={
				!gameRow.finished
					? gameRow.primaryDialogueId === null &&
					  gameRow.generalDialogueId === null
						? {
								stage: "Unstarted",
								players,
						  }
						: gameRow.generalDialogueId === null
						? {
								stage: "Primary",
								dialogueId: gameRow.primaryDialogueId ?? -1, // not sure why unable to narrow
								players: primaryPlayers,
						  }
						: {
								stage: "General",
								dialogueId: gameRow.generalDialogueId,
								players: generalPlayers,
						  }
					: {
							stage: "Finished",
							players: generalPlayers,
					  }
			}
		/>
	)
}
