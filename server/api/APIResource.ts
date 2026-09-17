import type { APIResponse, Method, Params, User, Response } from "@j0code/shortlink-api-types"
import type { Route } from "@j0code/shortlink-api-types/routes"

export default abstract class APIResource<TRoute extends Route> {

	readonly route: TRoute
	readonly supportedMethods: Set<Method>

	constructor(route: TRoute, supportedMethods: Method[]) {
		this.route = route
		this.supportedMethods = new Set(supportedMethods)
	}

	get(body: unknown, params: Params, user: User | null): APIResponse<Response<TRoute, "GET">> {
		throw new Error(`GET not implemented on ${this.route}`)
	}

	post(body: unknown, params: Params, user: User | null): APIResponse<Response<TRoute, "POST">> {
		throw new Error(`POST not implemented on ${this.route}`)
	}

	delete(body: unknown, params: Params, user: User | null): APIResponse<Response<TRoute, "DELETE">> {
		throw new Error(`DELETE not implemented on ${this.route}`)
	}

}