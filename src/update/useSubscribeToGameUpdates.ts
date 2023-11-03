import { useRouter } from "next/navigation"

import useRealtime from "~/realtime/useRealtime"

export default function useSubscribeToGameUpdates({
	gameId,
}: {
	gameId: string
}) {
	const router = useRouter()

	useRealtime({
		channel: gameId,
		event: "update",
		onMessage: () => router.refresh(),
	})
}
