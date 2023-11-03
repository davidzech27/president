export const DEMOCRATIC_PRIMARY_DELEGATE_VOTES = 4714

export const DEMOCRATIC_PRIMARY_QUESTION_COUNT = 8

const DemocraticPrimaryDialogue: ({
	id: number
	question: boolean
	state: string | undefined
} & (
	| {
			content: string
	  }
	| {
			incumbentContent: string
			newcomerContent: string
	  }
	| {
			winnerContent: string
			loserContent: string
	  }
))[] = [
	{
		id: 1,
		incumbentContent: `You're a previous Democratic president running for reelection, and you're heading into the primary elections. Note that every state in the Democratic primaries has a proportional delegate allocation system (when delegates are allocated proportionally to the percentage of votes a candidate wins), though this has no actual effect on gameplay.

You have had reasonable success in your first primaries and are approaching Super Tuesday (a single Tuesday where the largest portion of primary elections take place).`,
		newcomerContent: `You're a Democratic representative looking to run for president. After successful exploratory committees (a method for a potential candidate to “test the waters” of the election) and promising benchmark polls (a poll taken to determine public opinion and if a candidate has a chance at becoming president), you're officially a Democratic candidate, heading into the primary elections. Note that every state in the Democratic primaries has a proportional delegate allocation system (when delegates are allocated proportionally to the percentage of votes a candidate wins), though this has no actual effect on gameplay.

You have had reasonable success in your first primaries and are approaching Super Tuesday (a single Tuesday where the largest portion of primary elections take place).`,
		question: false,
		state: undefined,
	},
	{
		id: 2,
		content: `In the California primaries, you're in a debate against your rival Democratic candidate, [OTHER_PLAYER].`,
		question: false,
		state: "California",
	},
	{
		id: 3,
		content: `What are your stances on the homelessness issue plaguing our country?`,
		question: true,
		state: "California",
	},
	{
		id: 4,
		content: `In many Southern states, there is legislation being passed that could be considered as discriminatory to members of the LGBTQIA+ community. What are your thoughts as to how we can continue to defend against anti-LGBTQIA+ ideology within our government?`,
		question: true,
		state: "California",
	},
	{
		id: 5,
		content: `According to the California Air Resources Board, California aims to have all new vehicles sold be electric by 2035. Would you support similar legislation on a national level?`,
		question: true,
		state: "California",
	},
	{
		id: 6,
		content: `Your next state is Oregon. You're participating in another debate against [OTHER_PLAYER], where you will be asked more specific policy-related questions.`,
		question: false,
		state: "Oregon",
	},
	{
		id: 7,
		content: `Oregon is the largest softwood lumber producer in the U.S. With the threat of the global climate crisis, how do you plan to balance environmental anti-logging policies with the large lumber industry in Oregon?`,
		question: true,
		state: "Oregon",
	},
	{
		id: 8,
		content: `In 2020 Oregon passed Measure 110, allowing for the decriminalization of possession of small amounts of controlled substances such as heroin, methamphetamines, cocaine and fentanyl. Do you support a similar policy that could be projected on a national scale?`,
		question: true,
		state: "Oregon",
	},
	{
		id: 9,
		content: `In more recent years, Portland and other large cities have seen an increase in rampant crime. How do you plan to address these issues while in office?`,
		question: true,
		state: "Oregon",
	},
	{
		id: 10,
		content: `You and [OTHER_PLAYER] are entering the later stages of the primary elections, and every delegate counts. A recent Democratic tracking poll (a poll that displays support over time) has shown that you and [OTHER_PLAYER] have been mostly even in terms of popular support nationwide. Your final primary debate is being held in New York.`,
		question: false,
		state: "New York",
	},
	{
		id: 11,
		content: `Natural disasters--like the flooding of New York--have greatly impacted the lives of many. How do you plan on supporting those suffering from these issues?`,
		question: true,
		state: "New York",
	},
	{
		id: 12,
		content: `With COVID-19 on the decline, should the United States continue anti-COVID and vaccination policies as we ease out of the pandemic or is the country ready to move on from the past in the pursuit of revitalizing the economy?`,
		question: true,
		state: "New York",
	},
	{
		id: 13,
		winnerContent: `After the final Democratic primaries, you received [POINTS] out of 4,714 delegate votes. At the Democratic National Convention (a convention of the Democratic party where the presidential nominee is announced), you are announced to be the Democratic candidate for the general election.`,
		loserContent: `After the final Democratic primaries, you received [POINTS] out of 4,714 delegate votes. At the Democratic National Convention (a convention of the Democratic party where the presidential nominee is announced), your rival candidate [OTHER_PLAYER] was announced to be the Democratic nominee, though you still plan to support them in the general election.`,
		question: false,
		state: undefined,
	},
]

export default DemocraticPrimaryDialogue
