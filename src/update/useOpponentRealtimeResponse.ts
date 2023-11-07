import { useCallback, useEffect } from "react"
import type Ably from "ably"

export default function useOpponentRealtimeResponse({
	channelPromise,
	election,
	role,
	onContent,
}: {
	channelPromise: Promise<Ably.Types.RealtimeChannelPromise> | undefined
	election: "DemocraticPrimary" | "RepublicanPrimary" | "General"
	role:
		| "DemocraticIncumbent"
		| "DemocraticNewcomer"
		| "RepublicanIncumbent"
		| "RepublicanNewcomer"
	onContent: (content: string) => void
}) {
	const subscribeEventName = `${
		election !== "General"
			? {
					DemocraticIncumbent: "DemocraticNewcomer",
					DemocraticNewcomer: "DemocraticIncumbent",
					RepublicanIncumbent: "RepublicanNewcomer",
					RepublicanNewcomer: "RepublicanIncumbent",
			  }[role]
			: {
					DemocraticIncumbent: "Republican",
					DemocraticNewcomer: "Republican",
					RepublicanIncumbent: "Democratic",
					RepublicanNewcomer: "Democratic",
			  }[role]
	}-response`

	const publishEventName = `${
		election !== "General"
			? role
			: {
					DemocraticIncumbent: "Democratic",
					DemocraticNewcomer: "Democratic",
					RepublicanIncumbent: "Republican",
					RepublicanNewcomer: "Republican",
			  }[role]
	}-response`

	useEffect(() => {
		if (channelPromise === undefined) return

		void channelPromise.then(async (channel) => {
			await channel.subscribe(subscribeEventName, ({ data: content }) => {
				if (typeof content === "string") onContent(content)
			})
		})

		return () => {
			void channelPromise.then((channel) => {
				channel.unsubscribe(subscribeEventName)
			})
		}
	}, [channelPromise, subscribeEventName, onContent])

	return useCallback(
		(content: string) => {
			void channelPromise?.then((channel) =>
				channel.publish(publishEventName, content)
			)
		},
		[channelPromise, publishEventName]
	)
}
