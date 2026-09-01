import { parseCookieHeader } from "./cookies.ts"
import { getUser } from "./db/db.ts"

export function cookieAuth(cookieHeader: string | undefined) {
	const cookies = parseCookieHeader(cookieHeader)
	console.log("cookieAuth", cookies)
	if (!cookies.user_id) return null
	if (!cookies.auth_key) return null

	const user = getUser(cookies.user_id)

	if (!user) return null
	if (user.key != cookies.auth_key) return null
	return user
}

export function tokenAuth(authHeader: string | undefined) {
	console.log("tokenAuth")
	return null
}

export function apiAuth(authHeader: string | undefined, cookieHeader: string | undefined) {
	if (authHeader) return tokenAuth(authHeader)
	return cookieAuth(cookieHeader)
}