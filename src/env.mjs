import { z } from "zod"
import { createEnv } from "@t3-oss/env-nextjs"

const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		DATABASE_URL: z.string().url(),
		DATABASE_AUTH_TOKEN: z.string(),
		SOKETI_APP_ID: z.string(),
		SOKETI_APP_SECRET: z.string(),
	},
	client: {
		NEXT_PUBLIC_SOKETI_HOST: z.string(),
		NEXT_PUBLIC_SOKETI_PORT: z.coerce.number(),
		NEXT_PUBLIC_SOKETI_APP_KEY: z.string(),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
		NEXT_PUBLIC_SOKETI_HOST: process.env.NEXT_PUBLIC_SOKETI_HOST,
		NEXT_PUBLIC_SOKETI_PORT: process.env.NEXT_PUBLIC_SOKETI_PORT,
		SOKETI_APP_ID: process.env.SOKETI_APP_ID,
		NEXT_PUBLIC_SOKETI_APP_KEY: process.env.NEXT_PUBLIC_SOKETI_APP_KEY,
		SOKETI_APP_SECRET: process.env.SOKETI_APP_SECRET,
	},
})

export default env
