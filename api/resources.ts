import type { Application } from "express"
import type APIResource from "./APIResource.ts"
import type { APIResponse, Method } from "./types.ts"
import CreateShortlink from "./CreateShortlink.ts"
import GetShortlink from "./GetShortlink.ts"

const resources: APIResource[] = [
	new CreateShortlink(),
	new GetShortlink()
]

export function registerResources(app: Application) {
	resources.forEach(resource => {
		resource.supportedMethods.forEach(method => {
			const lowerMethod = method.toLowerCase() as Lowercase<Method>

			app[lowerMethod](resource.route, async (req, res) => {
				try {
					const result = await resource[lowerMethod](req.body, req.params)
					res.status(result.status).send(result)
				} catch (err) {
					console.error("ERROR", "Uncaught error:", err)
					res.status(500).send({ success: false, status: 500, error: "Internal server error" } satisfies APIResponse<never>)
				}
			})
		})
	})
}