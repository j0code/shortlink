import * as v from "@valibot/valibot"

export const shortlinkSchema = v.object({
	id: v.string(),
	url: v.string(),
	created_at: v.pipe(
		v.string(),
		v.isoDateTimeSecond(),
	),
})

export type Shortlink = v.InferInput<typeof shortlinkSchema>