import { type APIResponseDataSchema, parseAPIResponse } from "@j0code/shortlink-api-types"
import { ValiError } from "@valibot/valibot"

export function get<TSchema extends APIResponseDataSchema>(baseUrl: string, route: string, auth: string | null, schema: TSchema) {
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return call(baseUrl, route, {
		method: "GET",
		headers
	}, schema)
}

export function del<TSchema extends APIResponseDataSchema>(baseUrl: string, route: string, auth: string | null, schema: TSchema) {
	const headers: HeadersInit = {}

	if (auth) {
		headers["Authorization"] = auth
	}

	return call(baseUrl, route, {
		method: "DELETE",
		headers
	}, schema)
}

export function post<TSchema extends APIResponseDataSchema>(baseUrl: string, route: string, auth: string | null, payload: unknown, schema: TSchema) {
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