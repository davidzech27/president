import { useEffect } from "react"
import Container from "~/components/Container"
import useGameUpdates from "~/update/useGameUpdates"

interface Props {
	gameId: string
	players: {
		DemocraticIncumbent: { name: string } | undefined
		DemocraticNewcomer: { name: string } | undefined
		RepublicanIncumbent: { name: string } | undefined
		RepublicanNewcomer: { name: string } | undefined
	}
}

export default function WaitingForPlayers({ gameId, players }: Props) {
	const updateGame = useGameUpdates({ gameId })

	useEffect(() => {
		void updateGame()
	}, [updateGame])

	return (
		<Container>
			<div className="flex flex-col gap-4">
				{players.DemocraticIncumbent && (
					<div className="text-4xl font-bold text-secondary mobile:text-xl">
						{players.DemocraticIncumbent.name}{" "}
						<span className="font-normal text-white">
							- Incumbent Democrat
						</span>
					</div>
				)}

				{players.DemocraticNewcomer && (
					<div className="text-4xl font-bold text-secondary mobile:text-xl">
						{players.DemocraticNewcomer.name}{" "}
						<span className="font-normal text-white">
							- Newcomer Democrat
						</span>
					</div>
				)}

				{players.RepublicanIncumbent && (
					<div className="text-4xl font-bold text-secondary mobile:text-xl">
						{players.RepublicanIncumbent.name}{" "}
						<span className="font-normal text-white">
							- Incumbent Republican
						</span>
					</div>
				)}

				{players.RepublicanNewcomer && (
					<div className="text-4xl font-bold text-secondary mobile:text-xl">
						{players.RepublicanNewcomer.name}{" "}
						<span className="font-normal text-white">
							- Newcomer Republican
						</span>
					</div>
				)}
			</div>

			<div className="pt-8" />

			<div className="text-4xl font-bold text-secondary mobile:text-2xl">
				waiting on {4 - Object.values(players).filter(Boolean).length}{" "}
				player
				{Object.values(players).filter(Boolean).length === 3 ? "" : "s"}
			</div>
		</Container>
	)
}
