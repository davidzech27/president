import { useEffect, useState } from "react"

import TextArea from "~/components/TextArea"

interface Props {
	content: string
	responseInput: string
	setResponseInput: (input: string) => void
	otherName: string
	otherResponse: string
	submitting: boolean
}

export default function Question({
	content,
	responseInput,
	setResponseInput,
	otherName,
	otherResponse,
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

	useEffect(() => {
		setResponseInput("")
	}, [content, setResponseInput])

	return !submitting ? (
		<div className="flex h-full flex-col justify-between p-6">
			<p className="text-2xl font-semibold leading-relaxed text-white mobile:text-xl">
				{content}
			</p>

			<div className="space-y-6">
				<p className="rounded-lg border border-white bg-white/20 px-3 py-2 text-lg font-medium text-white">
					<span className="font-light opacity-50">
						{otherName}&apos;s response:
					</span>{" "}
					{otherResponse || "(No response)"}
				</p>

				<TextArea
					input={responseInput}
					setInput={setResponseInput}
					required
					aria-label="your response"
					placeholder="your response"
					autoFocus
					className="w-full"
				/>
			</div>
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
