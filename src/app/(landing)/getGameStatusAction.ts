"use server"
import { z } from "zod"
import { unstable_noStore as noStore } from "next/cache"
import { eq, sql } from "drizzle-orm"

import validate from "~/util/validate"
import db from "~/database/db"
import { player } from "~/database/schema"

const getGameStatusAction = validate(z.object({ gameId: z.string() }))(
	async ({ gameId }) => {
		noStore()

		const playerCount = await db
			.select({ count: sql<number>`COUNT(*)` })
			.from(player)
			.where(eq(player.gameId, gameId))
			.then(([row]) => row?.count ?? 0)

		return (
			(["uncreated", "created", "created", "created"] as const)[
				playerCount
			] ?? "full"
		)
	}
)

export default getGameStatusAction
