"use server"
import { zact } from "zact/server"
import { z } from "zod"
import { cookies } from "next/headers"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"

import db from "~/database/db"
import { game, player } from "~/database/schema"
import { setAuth } from "~/auth/jwt"

const createGameAction = zact(
	z.object({ gameId: z.string(), name: z.string() })
)(async ({ gameId, name }) => {
	noStore()

	await db.transaction(async (tx) => {
		await Promise.all([
			db.insert(game).values({
				id: gameId,
				createdAt: new Date(),
			}),
			tx.insert(player).values({
				gameId,
				role: "DemocraticIncumbent",
				name,
				joinedAt: new Date(),
			}),
		])
	})

	await setAuth({
		cookies,
		auth: {
			gameId,
			role: "DemocraticIncumbent",
			name,
		},
	})

	redirect(`/game/${gameId}`)
})

export default createGameAction
