import { z } from "zod"
import { createEnv } from "@t3-oss/env-nextjs"

const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		JWT_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		DATABASE_AUTH_TOKEN: z.string(),
		OPENAI_SECRET_KEY: z.string(),
		ABLY_API_KEY: z.string(),
	},
	client: {},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		JWT_SECRET: process.env.JWT_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
		OPENAI_SECRET_KEY: process.env.OPENAI_SECRET_KEY,
		ABLY_API_KEY: process.env.ABLY_API_KEY,
	},
})

export default env
