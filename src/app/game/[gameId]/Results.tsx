"use client"
import { GENERAL_ELECTORAL_VOTES } from "~/dialogue/General"
import useGameUpdates from "~/update/useGameUpdates"
import Container from "~/components/Container"
import useGameChannelPromise from "~/update/useGameChannelPromise"

interface Props {
	gameId: string
	players: {
		Democratic: { name: string; portion: number }
		Republican: { name: string; portion: number }
	}
}

export default function Results({ gameId, players }: Props) {
	const channelPromise = useGameChannelPromise({ gameId })

	useGameUpdates({ channelPromise })

	return (
		<Container>
			<div className="text-4xl font-bold text-white mobile:text-2xl">
				{players.Democratic.portion >= players.Republican.portion
					? players.Democratic.name
					: players.Republican.name}{" "}
				won the election with{" "}
				{Math.round(
					(players.Democratic.portion >= players.Republican.portion
						? players.Democratic.portion
						: players.Republican.portion) * GENERAL_ELECTORAL_VOTES
				)}{" "}
				electoral votes!
			</div>
		</Container>
	)
}
