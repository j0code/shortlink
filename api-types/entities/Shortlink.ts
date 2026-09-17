import * as v from "@valibot/valibot"
import { isoDate } from "../base.ts"

export const shortlinkSchema = v.object({
	id: v.string(),
	url: v.string(),
	owner_id: v.nullable(v.string()),
	restricted: v.boolean(),
	created_at: isoDate,
	expires_at: v.nullable(isoDate),
})

export const shortlinkInfoSchema = v.intersect([
	shortlinkSchema,
	v.object({
		visitCount: v.number(),
	})
])

export type Shortlink = v.InferOutput<typeof shortlinkSchema>
export type ShortlinkInfo = v.InferOutput<typeof shortlinkInfoSchema>