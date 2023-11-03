"use client"
import { useState, useEffect } from "react"
import GeneralDialogue, { GENERAL_ELECTORAL_VOTES } from "~/dialogue/General"

import continueDialogueAction from "./continueDialogueAction"
import useSubscribeToGameUpdates from "~/update/useSubscribeToGameUpdates"
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
}

export default function General({ gameId, role, dialogueId, players }: Props) {
	useSubscribeToGameUpdates({ gameId })

	const party = role.startsWith("Democratic") ? "Democratic" : "Republican"

	const dialogue = GeneralDialogue.find(({ id }) => id === dialogueId)

	if (dialogue === undefined) throw new Error("Dialogue is undefined")

	const [responseInput, setResponseInput] = useState("")

	const [secondsLeft, setSecondsLeft] = useState(dialogue.question ? 30 : 10)

	const [submitting, setSubmitting] = useState(false)

	const [submitted, setSubmitted] = useState(false)

	useEffect(() => {
		const submitAt = new Date(
			new Date().valueOf() + (dialogue.question ? 30 : 10) * 1000
		)

		const updateSecondsLeft = () => {
			const secondsLeft = Math.ceil(
				(submitAt.valueOf() - new Date().valueOf()) / 1000
			)

			setSecondsLeft(secondsLeft)
		}

		updateSecondsLeft()

		const intervalId = setInterval(updateSecondsLeft, 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [dialogue])

	useEffect(() => {
		console.log({ secondsLeft })

		if (secondsLeft <= 0 && !submitted) {
			setSubmitted(true)

			if (dialogue.question) setSubmitting(true)

			void continueDialogueAction({
				gameId,
				dialogueId,
				stage: "Primary",
				response: dialogue.question ? responseInput : undefined,
			}).finally(() => {
				setSubmitting(false)

				setSubmitted(false)
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [secondsLeft, gameId, dialogueId, dialogue, responseInput])

	const isWinner =
		(players.Democratic >= players.Republican && party === "Democratic") ||
		(players.Democratic < players.Republican && party === "Republican")

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
				secondsLeft={secondsLeft}
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
					<Question
						content={content}
						responseInput={responseInput}
						setResponseInput={setResponseInput}
						submitting={submitting}
					/>
				) : (
					<Message content={content} />
				)}
			</div>
		</Container>
	)
}