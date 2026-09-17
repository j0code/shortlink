import { error, type User } from "@j0code/shortlink-api-types"
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

export type AuthType = "Unauthenticated" | "Unauthorized" | "Authorized"
export type AuthState = {
	auth: "Unauthenticated",
	user: null
} | {
	auth: "Unauthorized" | "Authorized",
	user: User
}

export function authorized(user: User | null, permissionCheck: (user: User) => boolean): AuthState {
	if (!user) {
		return { auth: "Unauthenticated", user }
	}
	if (!permissionCheck(user)) {
		return { auth: "Unauthorized", user }
	}
	return { auth: "Authorized", user }
}

export function authError(auth: Exclude<AuthType, "Authorized">) {
	switch (auth) {
		case "Unauthorized":
			return error("Unauthorized", 403)
		case "Unauthenticated":
			return error("Unauthenticated", 401)
	}
}