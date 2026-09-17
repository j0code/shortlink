import * as routes from "@j0code/shortlink-api-types/routes"
import type { Params, GETRoute, POSTRoute, DELETERoute } from "@j0code/shortlink-api-types"
import { resources } from "@j0code/shortlink-api-types"
import * as v from "@valibot/valibot"

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

	deleteShortlink(id: string) {
		return this.$delete(routes.SHORTLINK, { id })
	}

	$get(route: GETRoute, params: Params) {
		const schema = resources[route]["GET"].response
		return get(this.baseUrl, routes.substitute(route, params), this.auth, schema)
	}

	$delete(route: DELETERoute, params: Params) {
		const schema = resources[route]["DELETE"].response
		return del(this.baseUrl, routes.substitute(route, params), this.auth, schema)
	}

	$post(route: POSTRoute, params: Params, payload: unknown) {
		const schema = resources[route]["POST"].response
		return post(this.baseUrl, routes.substitute(route, params), this.auth, payload, schema)
	}

}

function get<TSchema extends v.GenericSchema>(baseUrl: string, route: string, auth: string | null, schema: TSchema) {
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return call(baseUrl, route, {
		method: "GET",
		headers
	}, schema)
}

function del<TSchema extends v.GenericSchema>(baseUrl: string, route: string, auth: string | null, schema: TSchema) {
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return call(baseUrl, route, {
		method: "DELETE",
		headers
	}, schema)
}

function post<TSchema extends v.GenericSchema>(baseUrl: string, route: string, auth: string | null, payload: unknown, schema: TSchema) {
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

async function call<TSchema extends v.GenericSchema>(baseUrl: string, route: string, init: RequestInit, schema: TSchema): Promise<v.InferOutput<typeof schema>> {
	const url = `${baseUrl}${route}`

	const res = await fetch(url, init)
	const body = await res.json()

	return v.parse(schema, body)
}