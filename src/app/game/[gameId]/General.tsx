"use client"
import { useState, useEffect } from "react"
import GeneralDialogue, { GENERAL_ELECTORAL_VOTES } from "~/dialogue/General"

import continueDialogueAction from "./continueDialogueAction"
import useGameUpdates from "~/update/useGameUpdates"
import Container from "~/components/Container"
import Header from "./Header"
import Question from "./Question"
import Message from "./Message"

interface Props {
	gameId: string
	role:
		| "DemocraticIncumbent"
		| "DemocraticNewcomer"
		| "RepublicanIncumbent"
		| "RepublicanNewcomer"
	dialogueId: number
	players: {
		Democratic: { name: string; portion: number }
		Republican: { name: string; portion: number }
	}
	reaction: string | undefined
}

export default function General({
	gameId,
	role,
	dialogueId,
	players,
	reaction,
}: Props) {
	const updateGame = useGameUpdates({ gameId })

	const party = role.startsWith("Democratic") ? "Democratic" : "Republican"

	const dialogue = GeneralDialogue.find(({ id }) => id === dialogueId)

	if (dialogue === undefined) throw new Error("Dialogue is undefined")

	const [responseInput, setResponseInput] = useState("")

	const [secondsLeft, setSecondsLeft] = useState<number | undefined>(
		dialogue.question ? 60 : 10
	)

	useEffect(() => {
		setSecondsLeft(dialogue.question ? 60 : 10)
	}, [dialogue])

	const submitting = secondsLeft === undefined && dialogue.question

	useEffect(() => {
		const submitAt = new Date(
			new Date().valueOf() + (dialogue.question ? 30 : 10) * 1000
		)

		const updateSecondsLeft = () => {
			const secondsLeft = Math.ceil(
				(submitAt.valueOf() - new Date().valueOf()) / 1000
			)

			setSecondsLeft((prevSecondsLeft) =>
				prevSecondsLeft === undefined
					? undefined
					: Math.max(secondsLeft, 0)
			)
		}

		updateSecondsLeft()

		const intervalId = setInterval(updateSecondsLeft, 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [dialogue])

	useEffect(() => {
		if (secondsLeft !== undefined && secondsLeft === 0) {
			setSecondsLeft(undefined)

			void continueDialogueAction({
				gameId,
				dialogueId,
				stage: "General",
				response:
					dialogue.question && reaction === undefined
						? responseInput
						: undefined,
			}).then(updateGame)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [secondsLeft, gameId, dialogueId, dialogue, responseInput])

	const isWinner =
		(players.Democratic.portion >= players.Republican.portion &&
			party === "Democratic") ||
		(players.Democratic.portion < players.Republican.portion &&
			party === "Republican")

	const content = (
		"content" in dialogue
			? dialogue.content
			: "democraticContent" in dialogue && party === "Democratic"
			? dialogue.democraticContent
			: "republicanContent" in dialogue && party === "Republican"
			? dialogue.republicanContent
			: "winnerContent" in dialogue && isWinner
			? dialogue.winnerContent
			: "loserContent" in dialogue && !isWinner
			? dialogue.loserContent
			: undefined
	)
		?.replaceAll(
			"[OTHER_PLAYER]",
			{
				Democratic: players.Republican.name,
				Republican: players.Democratic.name,
			}[party]
		)
		.replaceAll(
			"[POINTS]",
			Math.round(
				{
					Democratic: players.Republican.portion,
					Republican: players.Democratic.portion,
				}[party] * GENERAL_ELECTORAL_VOTES
			).toString()
		)

	if (content === undefined) throw new Error("Content is undefined")

	return (
		<Container>
			<Header
				secondsLeft={secondsLeft ?? 0}
				leftPoints={Math.round(
					players.Democratic.portion * GENERAL_ELECTORAL_VOTES
				)}
				rightPoints={Math.round(
					players.Republican.portion * GENERAL_ELECTORAL_VOTES
				)}
				totalPoints={GENERAL_ELECTORAL_VOTES}
			/>

			<div className="w-full flex-1 rounded-lg border border-white">
				{dialogue.question ? (
					reaction === undefined ? (
						<Question
							content={content}
							responseInput={responseInput}
							setResponseInput={setResponseInput}
							submitting={submitting}
						/>
					) : (
						<Message content={reaction} />
					)
				) : (
					<Message content={content} />
				)}
			</div>
		</Container>
	)
}
