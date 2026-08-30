import * as v from "@valibot/valibot"

export const shortlinkSchema = v.object({
	id: v.string(),
	url: v.string()
})

export type Shortlink = v.InferInput<typeof shortlinkSchema>