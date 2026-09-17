import * as v from "@valibot/valibot"

export const visitCountSchema = v.object({
	count: v.number(),
})

export type VisitCount = v.InferInput<typeof visitCountSchema>