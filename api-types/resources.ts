import * as routes from "./routes.ts"
import type { Method } from "./base.ts"
import type { ArraySchema, IntersectSchema, ObjectSchema } from "./helpers.ts"
import type * as v from "@valibot/valibot"
import { usersPostRequestSchema, usersPostResponseSchema } from "./resources/users.ts"
import { shortlinksPostRequestSchema, shortlinksPostResponseSchema } from "./resources/shortlinks.ts"
import { shortlinkDeleteRequestSchema, shortlinkDeleteResponseSchema, shortlinkGetRequestSchema, shortlinkGetResponseSchema } from "./resources/shortlink.ts"
import { shortlinkVisitsGetRequestSchema, shortlinkVisitsGetResponseSchema } from "./resources/shortlink_visits.ts"

export const resources = {
	[routes.USERS]: {
		"POST": {
			request: usersPostRequestSchema,
			response: usersPostResponseSchema
		}
	},
	[routes.USER]: {
		
	},
	[routes.SHORTLINKS]: {
		"POST": {
			request: shortlinksPostRequestSchema,
			response: shortlinksPostResponseSchema
		}
	},
	[routes.SHORTLINK]: {
		"GET": {
			request: shortlinkGetRequestSchema,
			response: shortlinkGetResponseSchema
		},
		"DELETE": {
			request: shortlinkDeleteRequestSchema,
			response: shortlinkDeleteResponseSchema
		}
	},
	[routes.SHORTLINK_VISITS]: {
		"GET": {
			request: shortlinkVisitsGetRequestSchema,
			response: shortlinkVisitsGetResponseSchema
		}
	}
} as const satisfies Record<routes.Route, Partial<Record<Method, ResourceSchemas>>>

type ResourceSchemas = {
	request: ObjectSchema | v.NeverSchema<undefined>
	response: ObjectSchema | IntersectSchema | ArraySchema
}

export type Request<TRoute extends routes.Route, TMethod extends Method> =
	TRoute extends unknown
	? (typeof resources)[TRoute] extends { [K in TMethod]: ResourceSchemas }
		? v.InferOutput<(typeof resources)[TRoute][TMethod]["request"]>
		: never
	: never

export type Response<TRoute extends routes.Route, TMethod extends Method> =
	TRoute extends unknown
	? (typeof resources)[TRoute] extends { [K in TMethod]: ResourceSchemas }
		? v.InferOutput<(typeof resources)[TRoute][TMethod]["response"]>
		: never
	: never