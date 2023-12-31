import { GeistSans } from "geist/font"

import "./globals.css"

export const metadata = {
	title: "president game",
	description: "ai-powered presidential election simulator",
	metadataBase: new URL("https://presidentgame.vercel.app"),
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={GeistSans.className}>
			<body className="absolute inset-0">{children}</body>
		</html>
	)
}
