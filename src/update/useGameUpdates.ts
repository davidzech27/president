import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import type Ably from "ably"

export default function useGameUpdates({
	channelPromise,
}: {
	channelPromise: Promise<Ably.Types.RealtimeChannelPromise> | undefined
}) {
	const router = useRouter()

	useEffect(() => {
		if (channelPromise === undefined) return

		void channelPromise.then(async (channel) => {
			await channel.subscribe("update", () => {
				router.refresh()
			})
		})

		return () => {
			void channelPromise.then((channel) => {
				channel.unsubscribe("update")
			})
		}
	}, [channelPromise, router])

	return useCallback(() => {
		void channelPromise?.then((channel) => channel.publish("update", {}))
	}, [channelPromise])
}
