import type { Params } from "./base.ts"

export const USERS = "/users"
export const USER = "/users/:id"
export const SHORTLINKS = "/shortlinks"
export const SHORTLINK = "/shortlinks/:id"
export const SHORTLINK_VISITS = "/shortlinks/:id/visits"

export const routes = [USERS, USER, SHORTLINKS, SHORTLINK, SHORTLINK_VISITS] as const satisfies `/${string}`[]
export type Route = (typeof routes)[number]

export function substitute(route: Route, params: Params): `/${string}` {
	const segments = route.substring(1).split("/")

	segments.forEach((seg, i) => {
		if (!seg.startsWith(":")) {
			return
		}

		const key = seg.substring(1)

		if (!(key in params) || typeof params[key] != "string" || params[key].length == 0) {
			throw RangeError(`params has no ${key} key or params[${key}] is invalid`)
		}

		segments[i] = params[key]
	})

	return `/${segments.join("/")}`
}