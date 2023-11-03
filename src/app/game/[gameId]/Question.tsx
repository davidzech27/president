import { useEffect, useState } from "react"

import TextArea from "~/components/TextArea"

interface Props {
	content: string
	responseInput: string
	setResponseInput: (input: string) => void
	submitting: boolean
}

export default function Question({
	content,
	responseInput,
	setResponseInput,
	submitting,
}: Props) {
	const [dots, setDots] = useState(4)

	useEffect(() => {
		const intervalId = setInterval(
			() => setDots((prevDots) => (prevDots % 4) + 1),
			250
		)

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	return !submitting ? (
		<div className="flex h-full flex-col justify-between p-6">
			<p className="text-2xl font-semibold leading-relaxed text-white mobile:text-xl">
				{content}
			</p>

			<TextArea
				input={responseInput}
				setInput={setResponseInput}
				required
				aria-label="your response"
				placeholder="your response"
				autoFocus
			/>
		</div>
	) : (
		<div className="flex h-full flex-col justify-center p-6">
			<p className="text-center text-4xl font-semibold leading-relaxed text-white mobile:text-2xl">
				all of America is picking apart your responses right now
				{Array(dots).fill(".")}
			</p>
		</div>
	)
}
