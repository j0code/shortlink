import type { Application, Request, Response } from "express"
import type APIResource from "./APIResource.ts"
import type { APIResponse, Method } from "./types.ts"
import CreateShortlink from "./CreateShortlink.ts"
import GetShortlink from "./GetShortlink.ts"
import GetVisits from "./GetVisits.ts"

const resources: APIResource[] = [
	new CreateShortlink(),
	new GetShortlink(),
	new GetVisits()
]

export function registerResources(app: Application) {
	resources.forEach(resource => {
		resource.supportedMethods.forEach(method => {
			const lowerMethod = method.toLowerCase() as Lowercase<Method>

			app[lowerMethod](resource.route, async (req, res) => {
				try {
					const result = await resource[lowerMethod](req.body, req.params)
					cors(req, res)
					res.status(result.status).send(result)
				} catch (err) {
					console.error("ERROR", "Uncaught error:", err)
					res.status(500).send({ success: false, status: 500, error: "Internal server error" } satisfies APIResponse<never>)
				}
			})
		})

		app.options(resource.route, (req, res) => {
			cors(req, res)
			res.status(200).end()
		})
	})
}

function cors(req: Request, res: Response) {
	const origin = req.headers.origin
	if (origin) res.appendHeader("Access-Control-Allow-Origin", origin)
	else res.appendHeader("Access-Control-Allow-Origin", "*")
	res.appendHeader("Access-Control-Allow-Headers", "Content-Type")
	return
}