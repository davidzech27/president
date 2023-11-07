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

export default async function ratePrimaryDebate({
	party,
	question,
	state,
	responses,
}: {
	party: "Democratic" | "Republican"
	question: string
	state: string
	responses: { Incumbent: string; Newcomer: string }
}) {
	try {
		const messages = [
			{
				role: "system" as const,
				content: `You are a political debate simulator bot.`,
			},
			{
				role: "user" as const,
				content: `An incumbent candidate and a newcomer candidate are in a ${party} presidential debate in ${state} during the ${party} primaries. The following is a question the candidates were asked and everything that each candidate said in response over the course of the debate:

Question: """${question}"""
Incumbent candidate response: """${responses.Incumbent}"""
Newcomer candidate response: """${responses.Incumbent}"""

Given that this is a ${party} debate in the state of ${state}, narrate the nation's reaction to what each candidate said. Then, assign each candidate a rating out of 10 as to how well their responses impacted their campaign to be the ${party} nominee.

Output the following format alone:
Reaction: string
Incumbent candidate rating: number
Newcomer candidate rating: number

This is very important to my career. Begin.`,
			},
		]

		console.info(messages)

		const completion = await getCompletion(messages)

		console.info(`${party} completion:`, completion)

		const reaction = completion.match(/(?<=^Reaction[ ]*:[ ]*).+/gm)?.[0]
		const incumbentRating = Number(
			completion.match(
				/(?<=^Incumbent candidate rating[ ]*:[ ]*).+/gm
			)?.[0]
		)
		const newcomerRating = Number(
			completion.match(
				/(?<=^Newcomer candidate rating[ ]*:[ ]*).+/gm
			)?.[0]
		)

		return {
			reaction,
			ratings: {
				Incumbent: !isNaN(incumbentRating) ? incumbentRating : 5,
				Newcomer: !isNaN(newcomerRating) ? newcomerRating : 5,
			},
		}
	} catch (error) {
		console.error(error)

		return {
			reaction: undefined,
			ratings: {
				Incumbent: 5,
				Newcomer: 5,
			},
		}
	}
}
