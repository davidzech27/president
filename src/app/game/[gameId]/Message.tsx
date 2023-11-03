interface Props {
	content: string
}

export default function Message({ content }: Props) {
	return (
		<div className="p-6">
			<p className="text-2xl font-semibold leading-relaxed text-white mobile:text-xl">
				{content}
			</p>
		</div>
	)
}
