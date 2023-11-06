interface Props {
	secondsLeft: number
	leftPoints: number
	rightPoints: number
	totalPoints: number
}

export default function Header({
	secondsLeft,
	leftPoints,
	rightPoints,
	totalPoints,
}: Props) {
	return (
		<div className="flex justify-center pb-6 mobile:pb-11">
			<div className="flex space-x-2.5">
				<div className="font-bold text-white">{leftPoints}</div>

				<div className="flex w-48 justify-between rounded-lg border border-white bg-white/10">
					<div
						style={{
							width: (leftPoints / totalPoints) * 192,
						}}
						className="rounded-l-lg bg-primary"
					/>

					<div
						style={{
							width: (rightPoints / totalPoints) * 192,
						}}
						className="rounded-r-lg bg-secondary"
					/>
				</div>

				<div className="font-bold text-white">{rightPoints}</div>
			</div>

			<div className="absolute right-8 text-xl font-bold text-white mobile:right-auto mobile:top-14">
				{secondsLeft} seconds left
			</div>
		</div>
	)
}
