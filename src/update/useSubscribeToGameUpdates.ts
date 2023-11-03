import { useRouter } from "next/navigation"
import { useEffect } from "react"

// import useRealtime from "~/realtime/useRealtime"

export default function useSubscribeToGameUpdates({
	gameId,
}: {
	gameId: string
}) {
	const router = useRouter()

	// useRealtime({
	// 	channel: gameId,
	// 	event: "update",
	// 	onMessage: () => router.refresh(),
	// })

	useEffect(() => {
		const intervalId = setInterval(() => router.refresh(), 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [router])
}
