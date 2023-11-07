import { useState, useRef, useEffect } from "react"
import type Ably from "ably"

export default function useGameChannelPromise({ gameId }: { gameId: string }) {
	const [channelPromise, setChannelPromise] =
		useState<Promise<Ably.Types.RealtimeChannelPromise>>()

	const effectCalled = useRef(false)

	useEffect(() => {
		if (effectCalled.current) return

		effectCalled.current = true

		const instantiatedChannelPromise =
			new Promise<Ably.Types.RealtimeChannelPromise>(
				(res) =>
					void import("ably")
						.then((Ably) =>
							new Ably.Realtime.Promise({
								authUrl: "/ably-auth",
								authMethod: "POST",
							}).channels.get(`game:${gameId}`)
						)
						.then(res)
			)

		setChannelPromise(instantiatedChannelPromise)

		return () => {
			if (channelPromise !== undefined) {
				void instantiatedChannelPromise.then((channel) =>
					channel.unsubscribe()
				)
			}
		}
	}, [gameId, channelPromise])

	return channelPromise
}
