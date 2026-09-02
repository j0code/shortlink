import type { User } from "../db/schemas.ts"
import type { APIResponse, Method, Params } from "./types.ts"

export default abstract class APIResource {

	readonly route: string
	readonly supportedMethods: Set<Method>

	constructor(route: string, supportedMethods: Method[]) {
		this.route = route
		this.supportedMethods = new Set(supportedMethods)
	}

	get(body: unknown, params: Params, user: User | null):  APIResponse {
		throw new Error(`GET not implemented on ${this.route}`)
	}

	post(body: unknown, params: Params, user: User | null): APIResponse {
		throw new Error(`POST not implemented on ${this.route}`)
	}

}