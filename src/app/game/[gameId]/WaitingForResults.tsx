"use client"
import { GENERAL_ELECTORAL_VOTES } from "~/dialogue/General"
import Container from "~/components/Container"
import useSubscribeToGameUpdates from "~/update/useSubscribeToGameUpdates"

interface Props {
	gameId: string
	players: {
		Democratic: { name: string; portion: number }
		Republican: { name: string; portion: number }
	}
}

export default function WaitingForResults({ gameId, players }: Props) {
	useSubscribeToGameUpdates({ gameId })

	return (
		<Container>
			<div className="mobile:text-2xl text-4xl font-bold text-secondary">
				you did not make it to the general elections :(
			</div>

			<div className="pt-8" />

			<div className="flex flex-col gap-4">
				<div className="mobile:text-2xl text-4xl font-bold text-secondary">
					{players.Democratic.name}{" "}
					<span className="font-normal text-white">
						- {players.Democratic.portion * GENERAL_ELECTORAL_VOTES}
					</span>
				</div>

				<div className="mobile:text-2xl text-4xl font-bold text-secondary">
					{players.Republican.name}{" "}
					<span className="font-normal text-white">
						- {players.Republican.portion * GENERAL_ELECTORAL_VOTES}
					</span>
				</div>
			</div>
		</Container>
	)
}
