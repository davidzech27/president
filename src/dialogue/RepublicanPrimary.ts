export const REPUBLICAN_PRIMARY_DELEGATE_VOTES = 2469

export const REPUBLICAN_PRIMARY_QUESTION_COUNT = 8

const RepublicanPrimaryDialogue: ({
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
		incumbentContent: `You're a previous Republican president running for reelection, and you're heading into the primary elections. Note that most states in the Republican primaries incorporate elements of both proportional delegate allocation (when delegates are allocated proportionally to the percentage of votes a candidate wins) and winner-take-all delegate allocation (when delegates are allocated solely to the candidate winning the plurality of votes), though this has no actual effect on gameplay.

You have had reasonable success in your first primaries and are approaching Super Tuesday (a single Tuesday where the largest portion of primary elections take place).`,
		newcomerContent: `You're a Republican representative looking to run for president. After successful exploratory committees (a method for a potential candidate to “test the waters” of the election) and promising benchmark polls (a poll taken to determine public opinion and if a candidate has a chance at becoming president), you're officially a Republican candidate, heading into the primary elections. Note that most states in the Republican primaries incorporate elements of both proportional delegate allocation (when delegates are allocated proportionally to the percentage of votes a candidate wins) and winner-take-all delegate allocation (when delegates are allocated solely to the candidate winning the plurality of votes), though this has no actual effect on gameplay.

You have had reasonable success in your first primaries and are approaching Super Tuesday (a single Tuesday where the largest portion of primary elections take place).`,
		question: false,
		state: undefined,
	},
	{
		id: 2,
		content: `In the Idaho primaries, you're in a debate against your rival Republican candidate, [OTHER_PLAYER].`,
		question: false,
		state: "Idaho",
	},
	{
		id: 3,
		content: `Idaho House Bill 124 will remove Student IDs as a valid form of voter identification. What is your stance on this?`,
		question: true,
		state: "Idaho",
	},
	{
		id: 4,
		content: `Idaho House Bill 186 reinstates the firing squad as a form of capital punishment. Do you believe this is too severe a punishment and are there other forms of capital punishment that you would support?`,
		question: true,
		state: "Idaho",
	},
	{
		id: 5,
		content: `Idaho recently passed legislation to pay nurses in rural areas to help cover the student debt of those working in “underserved” areas of the state. Do you believe this is justifiable spending of government funds and taxpayer dollars?`,
		question: true,
		state: "Idaho",
	},
	{
		id: 6,
		content: `Your next state is Alabama. You're participating in another debate against [OTHER_PLAYER], where you will be asked more specific policy-related questions.`,
		question: false,
		state: "Alabama",
	},
	{
		id: 7,
		content: `Lawmakers in the Alabama Senate approved a bill forbidding doctors from providing gender confirming hormone treatment, puberty blockers, or sex reassignment surgery to treat transgender minors. This Bill did not pass the house. What aspects of gender transition, if any, do you believe should be banned and at what ages?`,
		question: true,
		state: "Alabama",
	},
	{
		id: 8,
		content: `The bill, HB24, recently passed the Alabama Senate which makes two or more arrests for loitering a misdemeanor and one can be punished with up to 30 days in jail and a $500 fine. Do you think this is an effective measure to counter homelessness and what other legislation would you put in place to counter the homelessness problem across America?`,
		question: true,
		state: "Alabama",
	},
	{
		id: 9,
		content: `In an effort to provide families choice on what type of education system their children go to, be it private, public, or homeschooled, Alabama has instituted a policy that gives parents $6,900 for each child for the 2024-2025 school year. Is this an effective use of the educational budget? How would you allocate money to give parents a choice on what educational institutions their children go to?`,
		question: true,
		state: "Alabama",
	},
	{
		id: 10,
		content: `You and [OTHER_PLAYER] are entering the later stages of the primary elections, and every delegate counts. A recent Republican tracking poll (a poll that displays support over time) has shown that you and [OTHER_PLAYER] have been mostly even in terms of popular support nationwide. Your final primary debate is being held in West Virginia.`,
		question: false,
		state: "West Virginia",
	},
	{
		id: 11,
		content: `With 91% of West Virginia’s total electricity generation coming from Coal-Fired Electric Power Plants, how would you balance legislation on sustainability while maintaining jobs and businesses that currently exist?`,
		question: true,
		state: "West Virginia",
	},
	{
		id: 12,
		content: `How do you intend to prepare for the potential of another global pandemic like COVID 19? What actions would you take if another such situation arises?`,
		question: true,
		state: "West Virginia",
	},
	{
		id: 13,
		winnerContent: `After the final Republican primaries, you received [POINTS] out of 2469 delegate votes. At the Republican National Convention (a convention of the Republican party where the presidential nominee is announced), you are announced to be the Republican candidate for the general election.`,
		loserContent: `After the final Republican primaries, you received [POINTS] out of 2469 delegate votes. At the Republican National Convention (a convention of the Republican party where the presidential nominee is announced), your rival candidate [OTHER_PLAYER] was announced to be the Republican nominee, though you still plan to support them in the general election.`,
		question: false,
		state: undefined,
	},
]

export default RepublicanPrimaryDialogue
