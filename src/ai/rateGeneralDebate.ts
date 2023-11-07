import openai from "./openai"

async function getCompletion(
	messages: { role: "system" | "assistant" | "user"; content: string }[]
) {
	const response = await openai.createChatCompletion({
		messages,
		model: "gpt-4-1106-preview",
		temperature: 0,
		presence_penalty: 0.25,
	})

	const json = (await response.json()) as
		| {
				choices: [{ message: { content: string } }]
				usage: { prompt_tokens: number; completion_tokens: number }
		  }
		| { error: { message: string } }

	if ("error" in json) {
		console.error(`OpenAI error: ${json.error.message}`)
	}

	if ("error" in json) {
		const response = await openai.createChatCompletion({
			messages,
			model: "gpt-4",
			temperature: 0,
			presence_penalty: 0.25,
		})

		const json = (await response.json()) as
			| {
					choices: [{ message: { content: string } }]
					usage: { prompt_tokens: number; completion_tokens: number }
			  }
			| { error: { message: string } }

		if ("error" in json) {
			throw new Error(`OpenAI error: ${json.error.message}`)
		} else {
			return json.choices[0].message.content
		}
	} else {
		return json.choices[0].message.content
	}
}

export default async function rateGeneralDebate({
	question,
	state,
	responses,
}: {
	question: string
	state: string
	responses: { Democratic: string; Republican: string }
}) {
	try {
		const messages = [
			{
				role: "system" as const,
				content: `You are a political debate simulator bot.`,
			},
			{
				role: "user" as const,
				content: `A Democratic candidate and a Republican candidate are in a presidential debate in ${state} leading up to the general election. The following is a question the candidates were asked and everything that each candidate said in response over the course of the debate:

Question: """${question}"""
Democratic candidate response: """${responses.Democratic}"""
Republican candidate response: """${responses.Republican}"""

Given that this is a presidential debate in the state of ${state} leading up to the general election, narrate the nation's reaction to what each candidate said. Then, assign each candidate a rating out of 10 as to how well their responses impacted their presidential campaign.

Output the following format alone:
Reaction: string
Democratic candidate rating: number
Republican candidate rating: number

This is very important to my career. Begin.`,
			},
		]

		console.info(messages)

		const completion = await getCompletion(messages)

		console.info(`Completion:`, completion)

		const reaction = completion.match(/(?<=^Reaction[ ]*:[ ]*).+/gm)?.[0]
		const democraticRating = Number(
			completion.match(
				/(?<=^Democratic candidate rating[ ]*:[ ]*).+/gm
			)?.[0]
		)
		const republicanRating = Number(
			completion.match(
				/(?<=^Republican candidate rating[ ]*:[ ]*).+/gm
			)?.[0]
		)

		return {
			reaction,
			ratings: {
				Democratic: !isNaN(democraticRating) ? democraticRating : 5,
				Republican: !isNaN(republicanRating) ? republicanRating : 5,
			},
		}
	} catch (error) {
		console.error(error)

		return {
			reaction: undefined,
			ratings: {
				Democratic: 5,
				Republican: 5,
			},
		}
	}
}
