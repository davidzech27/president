import TextInput from "~/components/TextInput"
import Button from "~/components/Button"

interface Props {
	input: string
	setInput: (input: string) => void
	submit: () => void
}

export default function NameForm({ input, setInput, submit }: Props) {
	const disabled = input === ""

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()

				if (!disabled) submit()
			}}
			className="flex space-x-2"
		>
			<TextInput
				input={input}
				setInput={setInput}
				required
				aria-label="your name"
				placeholder="your name"
				autoFocus
				className="mobile:w-48"
			/>

			<Button type="submit" disabled={disabled}>
				continue
			</Button>
		</form>
	)
}
