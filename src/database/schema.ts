import { sqliteTable, integer, primaryKey, text } from "drizzle-orm/sqlite-core"

export const game = sqliteTable("game", {
	id: text("id").primaryKey(),
	primaryDialogueId: integer("primary_dialogue_id"),
	generalDialogueId: integer("general_dialogue_id"),
	finished: integer("finished", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
})

export const player = sqliteTable(
	"player",
	{
		gameId: text("game_id").notNull(),
		role: text("role", {
			enum: [
				"DemocraticIncumbent",
				"DemocraticNewcomer",
				"RepublicanIncumbent",
				"RepublicanNewcomer",
			],
		}).notNull(),
		name: text("name").notNull(),
		joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
	},
	(table) => ({
		cpk: primaryKey(table.gameId, table.role),
	})
)

export const question = sqliteTable(
	"question",
	{
		gameId: text("game_id").notNull(),
		election: text("election", {
			enum: ["DemocraticPrimary", "RepublicanPrimary", "General"],
		}).notNull(),
		dialogueId: integer("dialogue_id").notNull(),
		incumbentResponse: text("incumbent_response"),
		newcomerResponse: text("newcomer_response"),
		incumbentPortion: integer("incumbent_portion"),
		newcomerPortion: integer("newcomer_portion"),
		democraticResponse: text("democratic_response"),
		republicanResponse: text("republican_response"),
		democraticPortion: integer("democratic_portion"),
		republicanPortion: integer("republican_portion"),
		reaction: text("reaction"),
		presentedAt: integer("presented_at", { mode: "timestamp" }).notNull(),
	},
	(table) => ({
		cpk: primaryKey(table.gameId, table.election, table.dialogueId),
	})
)
