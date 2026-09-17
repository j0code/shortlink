import * as v from "@valibot/valibot"

export type Method = "GET" | "POST" | "DELETE"
export type Params = Record<string, string>

export const isoDate = v.pipe(
	v.string(),
	v.isoTimestamp(),
)

export const successStatusSchema = v.union([
	v.literal(200)
])

export const errorStatusSchema = v.union([
	v.literal(400),
	v.literal(401),
	v.literal(403),
	v.literal(404),
	v.literal(500),
])

export type SuccessStatus = v.InferOutput<typeof successStatusSchema>
export type ErrorStatus = v.InferOutput<typeof errorStatusSchema>

export const emptySchema = v.optional(v.object({}))