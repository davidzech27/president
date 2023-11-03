"use client"
import { GENERAL_ELECTORAL_VOTES } from "~/dialogue/General"
import useSubscribeToGameUpdates from "~/update/useSubscribeToGameUpdates"
import Container from "~/components/Container"

interface Props {
	gameId: string
	players: {
		Democratic: { name: string; portion: number }
		Republican: { name: string; portion: number }
	}
}

export default function Results({ gameId, players }: Props) {
	useSubscribeToGameUpdates({ gameId })

	return (
		<Container>
			<div className="mobile:text-2xl text-4xl font-bold text-white">
				{players.Democratic.portion >= players.Republican.portion
					? players.Democratic.name
					: players.Republican.name}{" "}
				won the election with{" "}
				{(players.Democratic.portion >= players.Republican.portion
					? players.Democratic.portion
					: players.Republican.portion) *
					GENERAL_ELECTORAL_VOTES}{" "}
				electoral votes!
			</div>
		</Container>
	)
}
