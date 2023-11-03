import { cookies } from "next/headers"

import { getAuth } from "~/auth/jwt"
import Landing from "./Landing"

export const runtime = "edge"

export default async function IndexPage() {
	await getAuth({ cookies })

	return <Landing />
}
