import * as routes from "@j0code/shortlink-api-types/routes"
import type { Params, GETRoute, POSTRoute, DELETERoute, APIResponseDataSchema, ResponseSchema, Request } from "@j0code/shortlink-api-types"
import { parseAPIResponse, resources } from "@j0code/shortlink-api-types"
import { ValiError } from "@valibot/valibot"

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

function get<TSchema extends APIResponseDataSchema>(baseUrl: string, route: string, auth: string | null, schema: TSchema) {
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return call(baseUrl, route, {
		method: "GET",
		headers
	}, schema)
}

function del<TSchema extends APIResponseDataSchema>(baseUrl: string, route: string, auth: string | null, schema: TSchema) {
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return call(baseUrl, route, {
		method: "DELETE",
		headers
	}, schema)
}

function post<TSchema extends APIResponseDataSchema>(baseUrl: string, route: string, auth: string | null, payload: unknown, schema: TSchema) {
	console.log("payload", payload)
	const headers: HeadersInit = {
		"Content-Type": "application/json"
	}

	if (auth) {
		console.log("auth", auth)
		headers["Authorization"] = auth
	}

	return call(baseUrl, route, {
		method: "POST",
		body: JSON.stringify(payload),
		headers
	}, schema)
}

export async function getKey(password: string) {
	const pw = new TextEncoder().encode(password)
	const digest = await crypto.subtle.digest("sha-256", pw)
	return new Uint8Array(digest).toHex()
}

async function call<TSchema extends APIResponseDataSchema>(baseUrl: string, route: string, init: RequestInit, schema: TSchema) {
	const url = `${baseUrl}${route}`

	const res = await fetch(url, init)
	const body = await res.json()
	const result = parseAPIResponse(schema, body)

	if (!result.success) {
		console.error(`Server returned invalid response for ${route}:`, body)
		throw new ValiError(result.issues)
	}

	return result.output
}