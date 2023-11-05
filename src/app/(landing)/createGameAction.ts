"use server"
import { z } from "zod"
import { cookies } from "next/headers"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"

import validate from "~/util/validate"
import joinGameAction from "./joinGameAction"
import db from "~/database/db"
import { game, player } from "~/database/schema"
import { setAuth } from "~/auth/jwt"

const createGameAction = validate(
	z.object({ gameId: z.string(), name: z.string() })
)(async ({ gameId, name }) => {
	noStore()

	try {
		await db.insert(game).values({
			id: gameId,
			createdAt: new Date(),
		})
	} catch (_) {
		return await joinGameAction({ gameId, name })
	}

	await db.insert(player).values({
		gameId,
		role: "DemocraticIncumbent",
		name,
		joinedAt: new Date(),
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
