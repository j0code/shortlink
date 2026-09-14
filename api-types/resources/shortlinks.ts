import * as v from "@valibot/valibot"

export const shortlinksPostRequestSchema = v.object({
	url: v.pipe(
		v.string(),
		v.url("Invalid URL"),
	),
	claim: v.boolean(),
	restricted: v.boolean(),
	expires_at: v.nullable(v.pipe(
		v.string(),
		v.isoTimestamp(),
	))
})

export const shortlinksPostResponseSchema = v.object({
	id: v.string(),
})

export type ShortlinksPostRequest = v.InferOutput<typeof shortlinksPostRequestSchema>
export type ShortlinksPostResponse = v.InferOutput<typeof shortlinksPostResponseSchema>