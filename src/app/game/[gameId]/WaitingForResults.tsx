"use client"
import { GENERAL_ELECTORAL_VOTES } from "~/dialogue/General"
import Container from "~/components/Container"
import useGameUpdates from "~/update/useGameUpdates"

interface Props {
	gameId: string
	players: {
		Democratic: { name: string; portion: number }
		Republican: { name: string; portion: number }
	}
}

export default function WaitingForResults({ gameId, players }: Props) {
	useGameUpdates({ gameId })

	return (
		<Container>
			<div className="text-4xl font-bold text-secondary mobile:text-2xl">
				you did not make it to the general elections :(
			</div>

			<div className="pt-8" />

			<div className="flex flex-col gap-4">
				<div className="text-4xl font-bold text-secondary mobile:text-2xl">
					{players.Democratic.name}{" "}
					<span className="font-normal text-white">
						-{" "}
						{Math.round(
							players.Democratic.portion * GENERAL_ELECTORAL_VOTES
						)}
					</span>
				</div>

				<div className="text-4xl font-bold text-secondary mobile:text-2xl">
					{players.Republican.name}{" "}
					<span className="font-normal text-white">
						-{" "}
						{Math.round(
							players.Republican.portion * GENERAL_ELECTORAL_VOTES
						)}
					</span>
				</div>
			</div>
		</Container>
	)
}
