"use client"
import { useEffect, useState } from "react"

import DemocraticPrimaryDialogue, {
	DEMOCRATIC_PRIMARY_DELEGATE_VOTES,
} from "~/dialogue/DemocraticPrimary"
import RepublicanPrimaryDialogue, {
	REPUBLICAN_PRIMARY_DELEGATE_VOTES,
} from "~/dialogue/RepublicanPrimary"
import continueDialogueAction from "./continueDialogueAction"
import useGameUpdates from "~/update/useGameUpdates"
import useOpponentRealtimeResponse from "~/update/useOpponentRealtimeResponse"
import Container from "~/components/Container"
import Header from "./Header"
import Message from "./Message"
import Question from "./Question"
import useGameChannelPromise from "~/update/useGameChannelPromise"

interface Props {
	gameId: string
	role:
		| "DemocraticIncumbent"
		| "DemocraticNewcomer"
		| "RepublicanIncumbent"
		| "RepublicanNewcomer"
	dialogueId: number
	players: {
		Incumbent: { name: string; portion: number }
		Newcomer: { name: string; portion: number }
	}
	reaction: string | undefined
}

export default function Primary({
	gameId,
	role,
	dialogueId,
	players,
	reaction,
}: Props) {
	const channelPromise = useGameChannelPromise({ gameId })

	const updateGame = useGameUpdates({ channelPromise })

	useEffect(() => {
		if (dialogueId === 0) updateGame()
	}, [updateGame, dialogueId])

	const party = role.startsWith("Democratic") ? "Democratic" : "Republican"

	const dialogue = {
		Democratic: DemocraticPrimaryDialogue,
		Republican: RepublicanPrimaryDialogue,
	}[party].find(({ id }) => id === dialogueId)

	if (dialogue === undefined) throw new Error("Dialogue is undefined")

	const totalDelegates = {
		Democratic: DEMOCRATIC_PRIMARY_DELEGATE_VOTES,
		Republican: REPUBLICAN_PRIMARY_DELEGATE_VOTES,
	}[party]

	const [responseInput, setResponseInput] = useState("")

	const [otherResponse, setOtherResponse] = useState("")

	const updateResponse = useOpponentRealtimeResponse({
		channelPromise,
		role,
		election: {
			DemocraticIncumbent: "DemocraticPrimary" as const,
			DemocraticNewcomer: "DemocraticPrimary" as const,
			RepublicanIncumbent: "RepublicanPrimary" as const,
			RepublicanNewcomer: "RepublicanPrimary" as const,
		}[role],
		onContent: setOtherResponse,
	})

	useEffect(() => {
		setOtherResponse("")
	}, [dialogueId])

	useEffect(() => {
		updateResponse(responseInput)
	}, [updateResponse, responseInput])

	const [secondsLeft, setSecondsLeft] = useState<number | undefined>(
		dialogue.question ? 60 : dialogue.id === 0 ? 60 : 10
	)

	useEffect(() => {
		setSecondsLeft(dialogue.question ? 60 : dialogue.id === 0 ? 60 : 10)
	}, [dialogue, reaction])

	const submitting = secondsLeft === undefined && dialogue.question

	useEffect(() => {
		const submitAt = new Date(
			new Date().valueOf() +
				(dialogue.question ? 60 : dialogue.id === 0 ? 60 : 10) * 1000
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
	}, [dialogue, reaction])

	useEffect(() => {
		if (secondsLeft !== undefined && secondsLeft === 0) {
			setSecondsLeft(undefined)

			void continueDialogueAction({
				gameId,
				dialogueId,
				stage: "Primary",
				response:
					dialogue.question && reaction === undefined
						? responseInput || "(No response)"
						: undefined,
			}).then(updateGame)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [secondsLeft, gameId, dialogueId, dialogue, responseInput])

	const isIncumbent = role.includes("Incumbent")

	const isWinner =
		(players.Incumbent.portion >= players.Newcomer.portion &&
			isIncumbent) ||
		(players.Incumbent.portion < players.Newcomer.portion && !isIncumbent)

	const content = (
		"content" in dialogue
			? dialogue.content
			: "incumbentContent" in dialogue && isIncumbent
			? dialogue.incumbentContent
			: "newcomerContent" in dialogue && !isIncumbent
			? dialogue.newcomerContent
			: "winnerContent" in dialogue && isWinner
			? dialogue.winnerContent
			: "loserContent" in dialogue && !isWinner
			? dialogue.loserContent
			: undefined
	)
		?.replaceAll(
			"[OTHER_PLAYER]",
			isIncumbent ? players.Newcomer.name : players.Incumbent.name
		)
		.replaceAll(
			"[POINTS]",
			Math.round(
				(isIncumbent
					? players.Incumbent.portion
					: players.Newcomer.portion) * totalDelegates
			).toString()
		)

	if (content === undefined) throw new Error("Content is undefined")

	return (
		<Container>
			<Header
				secondsLeft={secondsLeft ?? 0}
				leftPoints={Math.round(
					players.Incumbent.portion * totalDelegates
				)}
				rightPoints={Math.round(
					players.Newcomer.portion * totalDelegates
				)}
				totalPoints={totalDelegates}
			/>

			<div className="w-full flex-1 rounded-lg border border-white">
				{dialogue.question ? (
					reaction === undefined ? (
						<Question
							content={content}
							responseInput={responseInput}
							setResponseInput={setResponseInput}
							otherName={
								players[
									{
										DemocraticIncumbent:
											"Newcomer" as const,
										DemocraticNewcomer:
											"Incumbent" as const,
										RepublicanIncumbent:
											"Newcomer" as const,
										RepublicanNewcomer:
											"Incumbent" as const,
									}[role]
								].name
							}
							otherResponse={otherResponse}
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
