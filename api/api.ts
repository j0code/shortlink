import * as routes from "@j0code/shortlink-api-types/routes"
import type { Params, GETRoute, POSTRoute, DELETERoute, ResponseSchema, Request } from "@j0code/shortlink-api-types"
import { resources } from "@j0code/shortlink-api-types"
import { del, get, post } from "./fetch.ts"
import { getKey } from "./util.ts"

export * from "./util.ts"

export default class API {

	readonly baseUrl: string
	private auth: string | null

	constructor(baseUrl: string) {
		this.baseUrl = new URL("/api/v0", baseUrl).href,
		this.auth = null
	}

	setToken(token: string) {
		this.auth = `token ${token}`
	}

	async createUser(password: string) {
		const key = await getKey(password)
		return this.$post(routes.USERS, {}, { key })
	}

	createShortlink(url: string, claim: boolean, restricted: boolean, expiresAt: Temporal.Instant | null = null) {
		const expires_at = expiresAt ? expiresAt.toString() : null
		return this.$post(routes.SHORTLINKS, {}, { url, claim, restricted, expires_at })
	}

	fetchShortlink(id: string) {
		return this.$get(routes.SHORTLINK, { id })
	}

	fetchShortlinkVisits(id: string) {
		return this.$get(routes.SHORTLINK_VISITS, { id })
	}

	deleteShortlink(id: string) {
		return this.$delete(routes.SHORTLINK, { id })
	}

	$get<TRoute extends GETRoute>(route: TRoute, params: Params) {
		const schema = resources[route]["GET"].response as ResponseSchema<TRoute, "GET">
		return get(this.baseUrl, routes.substitute(route, params), this.auth, schema)
	}

	$delete<TRoute extends DELETERoute>(route: TRoute, params: Params) {
		const schema = resources[route]["DELETE"].response as ResponseSchema<TRoute, "DELETE">
		return del(this.baseUrl, routes.substitute(route, params), this.auth, schema)
	}

	$post<TRoute extends POSTRoute>(route: TRoute, params: Params, payload: Request<TRoute, "POST">) {
		const schema = resources[route]["POST"].response as ResponseSchema<TRoute, "POST">
		return post(this.baseUrl, routes.substitute(route, params), this.auth, payload, schema)
	}

}
