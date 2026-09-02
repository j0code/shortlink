import type { Application, Request, Response } from "express"
import type APIResource from "./APIResource.ts"
import type { APIResponse, Method, Params } from "./types.ts"
import users from "./resources/users.ts"
import shortlinks from "./resources/shortlinks.ts"
import shortlink from "./resources/shortlink.ts"
import visits from "./resources/visits.ts"
import { apiAuth } from "../auth.ts"

const resources: APIResource[] = [
	new users(),
	new shortlinks(),
	new shortlink(),
	new visits()
]

export function registerResources(app: Application) {
	resources.forEach(resource => {
		resource.supportedMethods.forEach(method => {
			const lowerMethod = method.toLowerCase() as Lowercase<Method>

			app[lowerMethod](resource.route, async (req, res) => {
				const user = apiAuth(req.headers.authorization, req.headers.cookie)
				console.log("user:", user)

				try {
					const result = await resource[lowerMethod](req.body, req.params as Params, user)
					headers(req, res, resource)
					res.status(result.status).send(result)
				} catch (err) {
					console.error("ERROR", "Uncaught error:", err)
					res.status(500).send({ success: false, status: 500, error: "Internal server error" } satisfies APIResponse<never>)
				}
			})
		})

		app.options(resource.route, (req, res) => {
			headers(req, res, resource)
			res.status(200).end()
		})
	})
}

function headers(req: Request, res: Response, resource: APIResource) {
	cors(req, res)
	res.appendHeader("Allow", resource.supportedMethods.values().toArray().join(", "))
}

function cors(req: Request, res: Response) {
	const origin = req.headers.origin
	if (origin) res.appendHeader("Access-Control-Allow-Origin", origin)
	else res.appendHeader("Access-Control-Allow-Origin", "*")
	res.appendHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	return
}