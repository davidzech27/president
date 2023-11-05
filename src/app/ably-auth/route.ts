import Ably from "ably/promises"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import env from "~/env.mjs"
import { getAuthOrThrow } from "~/auth/jwt"

const ably = new Ably.Rest.Promise({
	key: env.ABLY_API_KEY,
})

export const POST = async () => {
	const auth = await getAuthOrThrow({ cookies })

	const tokenRequest = await ably.auth.createTokenRequest({
		clientId: auth.role,
		capability: {
			[`game:${auth.gameId}`]: ["publish", "subscribe"],
		},
	})

	return NextResponse.json(tokenRequest)
}
