import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import getGameStatusAction from "./getGameStatusAction"
import TextInput from "~/components/TextInput"
import Button from "~/components/Button"

interface Props {
	input: string
	setInput: (input: string) => void
	create: () => void
	join: () => void
	loading: boolean
}

export default function GameIdForm({
	input,
	setInput,
	create,
	join,
	loading,
}: Props) {
	const [status, setStatus] = useState<
		"none" | "uncreated" | "created" | "full"
	>("none")

	const getStatusDebouncedCallback = useDebouncedCallback(
		(gameId: string) =>
			getGameStatusAction({ gameId }).then((gameStatus) =>
				setStatus(gameStatus)
			),
		250,
		{ leading: true, trailing: true, maxWait: 250 }
	)

	useEffect(() => {
		if (input === "") setStatus("none")
		else void getStatusDebouncedCallback(input)
	}, [input, getStatusDebouncedCallback])

	const disabled = status === "none" || status === "full" || loading

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()

				if (status === "uncreated") create()

				if (status === "created") join()
			}}
			className="flex space-x-2"
		>
			<TextInput
				input={input}
				setInput={(input) => setInput(input.replaceAll(" ", "-"))}
				required
				aria-label="game id"
				placeholder="game id"
				autoFocus
				className="mobile:w-48"
			/>

			<Button type="submit" disabled={disabled}>
				{
					{
						none: "join or create game",
						uncreated: "create",
						created: "join",
						full: "game full",
					}[status]
				}
			</Button>
		</form>
	)
}
