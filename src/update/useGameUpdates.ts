import { useCallback, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type Ably from "ably"

export default function useGameUpdates({ gameId }: { gameId: string }) {
	const router = useRouter()

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

		void instantiatedChannelPromise.then(async (channel) => {
			await channel.subscribe("update", () => {
				router.refresh()
			})
		})

		setChannelPromise(instantiatedChannelPromise)

		return () => {
			if (channelPromise !== undefined)
				void instantiatedChannelPromise.then((channel) =>
					channel.unsubscribe()
				)
		}
	}, [gameId, channelPromise, router])

	return useCallback(() => {
		void channelPromise?.then((channel) => channel.publish("update", {}))
	}, [channelPromise])
}
