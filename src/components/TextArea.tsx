import ExpandingTextArea from "react-expanding-textarea"

import cn from "~/util/cn"

interface Props {
	input: string
	setInput: (input: string) => void
	required?: boolean
	"aria-label"?: string
	autoFocus?: boolean
	placeholder: string
	className?: string
}

export default function TextArea({
	input,
	setInput,
	required,
	"aria-label": ariaLabel,
	placeholder,
	autoFocus,
	className,
}: Props) {
	return (
		<ExpandingTextArea
			value={input}
			onChange={(e) => setInput(e.target.value)}
			required={required}
			aria-label={ariaLabel}
			placeholder={placeholder}
			autoFocus={autoFocus}
			className={cn(
				"rounded-lg border border-white bg-white/20 px-3 py-2 text-lg font-medium text-white outline-0 transition placeholder:select-none placeholder:font-light placeholder:text-white/50 focus:bg-white/30 focus:placeholder:text-white/60",
				className
			)}
		/>
	)
}
