"use server"
import { z } from "zod"
import { cookies } from "next/headers"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { eq, sql } from "drizzle-orm"

import validate from "~/util/validate"
import db from "~/database/db"
import { player, game } from "~/database/schema"
import { setAuth } from "~/auth/jwt"

const joinGameAction = validate(
	z.object({ gameId: z.string(), name: z.string() })
)(async ({ gameId, name }) => {
	noStore()

	const role = await db.transaction(
		async (tx) => {
			const playerCount = await db
				.select({ count: sql<number>`COUNT(*)` })
				.from(player)
				.where(eq(player.gameId, gameId))
				.then(([row]) => row?.count ?? 0)

			if (playerCount >= 4) {
				throw new Error("Game full")
			}

			const role =
				(
					[
						"DemocraticIncumbent",
						"DemocraticNewcomer",
						"RepublicanIncumbent",
						"RepublicanNewcomer",
					] as const
				)[playerCount] ?? "RepublicanNewcomer"

			await tx.insert(player).values({
				gameId,
				role,
				name,
				joinedAt: new Date(),
			})

			return role
		}
		// { behavior: "immediate" }
	)

	await setAuth({
		cookies,
		auth: {
			gameId,
			role,
			name,
		},
	})

	if (role === "RepublicanNewcomer") {
		await db
			.update(game)
			.set({ primaryDialogueId: 1 })
			.where(eq(game.id, gameId))
	}

	redirect(`/game/${gameId}`)
})

export default joinGameAction
