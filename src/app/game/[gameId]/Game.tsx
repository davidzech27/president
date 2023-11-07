"use client"
import WaitingForPlayers from "./WaitingForPlayers"
import Primary from "./Primary"
import WaitingForResults from "./WaitingForResults"
import General from "./General"
import Results from "./Results"

interface Props {
	gameId: string
	role:
		| "DemocraticIncumbent"
		| "DemocraticNewcomer"
		| "RepublicanIncumbent"
		| "RepublicanNewcomer"
	gameState:
		| {
				stage: "Unstarted"
				players: {
					DemocraticIncumbent: { name: string } | undefined
					DemocraticNewcomer: { name: string } | undefined
					RepublicanIncumbent: { name: string } | undefined
					RepublicanNewcomer: { name: string } | undefined
				}
		  }
		| {
				stage: "Primary"
				dialogueId: number
				players: {
					DemocraticIncumbent: { name: string; portion: number }
					DemocraticNewcomer: { name: string; portion: number }
					RepublicanIncumbent: { name: string; portion: number }
					RepublicanNewcomer: { name: string; portion: number }
				}
				reactions: {
					Democratic: string | undefined
					Republican: string | undefined
				}
		  }
		| {
				stage: "General"
				dialogueId: number
				players: {
					DemocraticIncumbent: {
						name: string
						portion: number | undefined
					}
					DemocraticNewcomer: {
						name: string
						portion: number | undefined
					}
					RepublicanIncumbent: {
						name: string
						portion: number | undefined
					}
					RepublicanNewcomer: {
						name: string
						portion: number | undefined
					}
				}
				reaction: string | undefined
		  }
		| {
				stage: "Finished"
				players: {
					DemocraticIncumbent: {
						name: string
						portion: number | undefined
					}
					DemocraticNewcomer: {
						name: string
						portion: number | undefined
					}
					RepublicanIncumbent: {
						name: string
						portion: number | undefined
					}
					RepublicanNewcomer: {
						name: string
						portion: number | undefined
					}
				}
		  }
}

export default function Game({ gameId, role, gameState }: Props) {
	if (gameState.stage === "Unstarted") {
		return <WaitingForPlayers gameId={gameId} players={gameState.players} />
	}

	if (gameState.stage === "Primary") {
		return (
			<Primary
				gameId={gameId}
				role={role}
				dialogueId={gameState.dialogueId}
				players={{
					Incumbent:
						role === "DemocraticIncumbent" ||
						role === "DemocraticNewcomer"
							? gameState.players.DemocraticIncumbent
							: gameState.players.RepublicanIncumbent,
					Newcomer:
						role === "DemocraticIncumbent" ||
						role === "DemocraticNewcomer"
							? gameState.players.DemocraticNewcomer
							: gameState.players.RepublicanNewcomer,
				}}
				reaction={
					gameState.reactions[
						{
							DemocraticIncumbent: "Democratic" as const,
							DemocraticNewcomer: "Democratic" as const,
							RepublicanIncumbent: "Republican" as const,
							RepublicanNewcomer: "Republican" as const,
						}[role]
					]
				}
			/>
		)
	}

	const generalPlayers = {
		Democratic: {
			name: (gameState.players.DemocraticIncumbent.portion !== undefined
				? gameState.players.DemocraticIncumbent
				: gameState.players.DemocraticNewcomer
			).name,
			portion:
				(gameState.players.DemocraticIncumbent.portion !== undefined
					? gameState.players.DemocraticIncumbent
					: gameState.players.DemocraticNewcomer
				).portion ?? 0,
		},
		Republican: {
			name: (gameState.players.RepublicanIncumbent.portion !== undefined
				? gameState.players.RepublicanIncumbent
				: gameState.players.RepublicanNewcomer
			).name,
			portion:
				(gameState.players.RepublicanIncumbent.portion !== undefined
					? gameState.players.RepublicanIncumbent
					: gameState.players.RepublicanNewcomer
				).portion ?? 0,
		},
	}

	if (
		gameState.stage === "General" &&
		gameState.players[role].portion !== undefined
	) {
		return (
			<General
				gameId={gameId}
				role={role}
				dialogueId={gameState.dialogueId}
				players={generalPlayers}
				reaction={gameState.reaction}
			/>
		)
	}

	if (
		gameState.stage === "General" &&
		gameState.players[role].portion === undefined
	) {
		return <WaitingForResults gameId={gameId} players={generalPlayers} />
	}

	if (gameState.stage === "Finished") {
		return <Results gameId={gameId} players={generalPlayers} />
	}
}
