export default class API {

	baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	createShortlink(url: string, expiresAt: Temporal.Instant | null = null) {
		const expires_at = expiresAt ? expiresAt.toString() : null
		return post(this.baseUrl, "/api/v0/shortlinks", { url, expires_at }) as Promise<APIResponse<{ id: string }>>
	}

}


function get(baseUrl: string, route: string) {
	const url = new URL(route, baseUrl)
	return fetch(url, {
		method: "GET",
	}).then(res => res.json())
}

function post(baseUrl: string, route: string, payload: unknown) {
	console.log("payload", payload)
	const url = new URL(route, baseUrl)
	return fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => res.json())
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