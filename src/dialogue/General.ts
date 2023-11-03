export const GENERAL_ELECTORAL_VOTES = 2469

export const GENERAL_QUESTION_COUNT = 8

const GeneralDialogue: ({
	id: number
	question: boolean
	state: string | undefined
} & (
	| {
			content: string
	  }
	| {
			democraticContent: string
			republicanContent: string
	  }
	| {
			winnerContent: string
			loserContent: string
	  }
))[] = [
	{
		id: 1,
		democraticContent: `As the Democratic party’s presidential nominee you'll need to participate in another series of debates against the Republican nominee, [OTHER_PLAYER]. Keep in mind that you need to appeal not only to your own party, but also members of the Republican party as well as undecided voters. Your goal is to obtain the most votes in the electoral college, win the election, and become the President of the United States.`,
		republicanContent: `As the Republican party’s presidential nominee you'll need to participate in another series of debates against the Democratic nominee, [OTHER_PLAYER]. Keep in mind that you need to appeal not only to your own party, but also members of the Democratic party as well as undecided voters. Your goal is to obtain the most votes in the electoral college, win the election, and become the President of the United States.`,
		question: false,
		state: undefined,
	},
	{
		id: 2,
		content: `Your first debate is in Michigan, a swing state (a state that could potentially be won by either candidate).`,
		question: false,
		state: "Michigan",
	},
	{
		id: 3,
		content: `If elected president, what actions would you take overseas in the war in Israel?`,
		question: true,
		state: "Michigan",
	},
	{
		id: 4,
		content: `Following the overturning of Roe v. Wade, what are your goals for the future of abortion policies in the US?`,
		question: true,
		state: "Michigan",
	},
	{
		id: 5,
		content: `What are your plans, if any, for addressing the changing global climate and reducing the country’s potentially negative impacts on the planet?`,
		question: true,
		state: "Michigan",
	},
	{
		id: 6,
		content: `Your next debate is in another potentially close state, Pennsylvania.`,
		question: false,
		state: "Pennsylvania",
	},
	{
		id: 7,
		content: `What do you think is the most important political issue in America today and how do you plan to address it?`,
		question: true,
		state: "Pennsylvania",
	},
	{
		id: 8,
		content: `To what extent would you be willing to compromise with a congress of the opposite party in order to keep the government running smoothly and fluidly?`,
		question: true,
		state: "Pennsylvania",
	},
	{
		id: 9,
		content: `How much of a role should the government play in ensuring that there is equal opportunity for success in the US?`,
		question: true,
		state: "Pennsylvania",
	},
	{
		id: 10,
		content: `Your last debate will take place in Ohio. This is once again another swing state.`,
		question: false,
		state: "Ohio",
	},
	{
		id: 11,
		content: `How do you plan to balance public safety and gun control with second amendment rights granted by the Constitution?`,
		question: true,
		state: "Ohio",
	},
	{
		id: 12,
		content: `Affirmative action has been declared unconstitutional by the Supreme Court. Do you think affirmative action still has its use in American education or was the decision beneficial for the country?`,
		question: true,
		state: "Ohio",
	},
	{
		id: 13,
		content: `The military continues to be a great portion of the United States’ budget spending. What are your budget plans regarding the US Armed Forces?`,
		question: true,
		state: "Ohio",
	},
	{
		id: 14,
		winnerContent: `It's the morning after election night, and you won [POINTS] out of 538 electoral votes. You're going to be the President of the United States!`,
		loserContent: `It's the morning after election night, and you won [POINTS] out of 538 electoral votes. You're not going to be the President of the United States, but [OTHER_PLAYER] will be.`,
		question: false,
		state: undefined,
	},
]

export default GeneralDialogue
