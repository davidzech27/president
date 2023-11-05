"use client"
import { useState } from "react"

import createGameAction from "./createGameAction"
import joinGameAction from "./joinGameAction"
import Container from "~/components/Container"
import NameForm from "./NameForm"
import GameIdForm from "./GameIdForm"

export default function Landing() {
	const [screen, setScreen] = useState<"name" | "gameId">("name")

	const [nameInput, setNameInput] = useState("")

	const [gameIdInput, setGameIdInput] = useState("")

	const [loading, setLoading] = useState(false)

	const createGame = async () => {
		setLoading(true)

		await createGameAction({ gameId: gameIdInput, name: nameInput })
	}

	const joinGame = async () => {
		setLoading(true)

		await joinGameAction({ gameId: gameIdInput, name: nameInput })
	}

	return (
		<Container>
			<h1 className="absolute top-4 text-2xl font-bold text-secondary">
				president
			</h1>

			<h2 className="text-center text-4xl font-bold text-secondary mobile:text-2xl">
				play an ai-powered presedential election simulator
			</h2>

			<div className="pt-8" />

			{
				{
					name: (
						<NameForm
							input={nameInput}
							setInput={setNameInput}
							submit={() => setScreen("gameId")}
						/>
					),
					gameId: (
						<GameIdForm
							input={gameIdInput}
							setInput={setGameIdInput}
							create={createGame}
							join={joinGame}
							loading={loading}
						/>
					),
				}[screen]
			}
		</Container>
	)
}
