export default function Container({ children }: React.PropsWithChildren) {
	return (
		<main
			className="flex h-full flex-col items-center justify-center bg-primary p-6"
			aria-live="assertive"
		>
			{children}
		</main>
	)
}
