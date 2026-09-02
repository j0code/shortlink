export default class API {

	readonly baseUrl: string
	private auth: string | null

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl,
		this.auth = null
	}

	setToken(token: string) {
		this.auth = `token ${token}`
	}

	async createUser(password: string) {
		const key = await getKey(password)
		return post(this.baseUrl, "/api/v0/users", this.auth, { key })
	}

	createShortlink(url: string, claim: boolean, expiresAt: Temporal.Instant | null = null) {
		const expires_at = expiresAt ? expiresAt.toString() : null
		return post(this.baseUrl, "/api/v0/shortlinks", this.auth, { url, claim, expires_at }) as Promise<APIResponse<{ id: string }>>
	}

	deleteShortlink(id: string) {
		return del(this.baseUrl, `/api/v0/shortlinks/${id}`, this.auth) as Promise<APIResponse<{ id: string }>> // TODO
	}

}


function get(baseUrl: string, route: string, auth: string | null) {
	const url = new URL(route, baseUrl)
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return fetch(url, {
		method: "GET",
		headers
	}).then(res => res.json())
}

function del(baseUrl: string, route: string, auth: string | null) {
	const url = new URL(route, baseUrl)
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return fetch(url, {
		method: "DELETE",
		headers
	}).then(res => res.json())
}

function post(baseUrl: string, route: string, auth: string | null, payload: unknown) {
	console.log("payload", payload)
	const url = new URL(route, baseUrl)
	const headers: HeadersInit = {
		"Content-Type": "application/json"
	}

	if (auth) {
		console.log("auth", auth)
		headers["Authorization"] = auth
	}

	return fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers
	}).then(res => res.json())
}

export async function getKey(password: string) {
	const pw = new TextEncoder().encode(password)
	const digest = await crypto.subtle.digest("sha-256", pw)
	return new Uint8Array(digest).toHex()
}

export type APIResponse<T = unknown> = {
	success: true,
	status: number
	result: T
} | {
	success: false,
	status: number,
	error: string,
	details?: unknown
}