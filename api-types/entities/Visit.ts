import * as v from "@valibot/valibot"
import { isoDate } from "../base.ts"

export const visitSchema = v.object({
	shortlink_id: v.string(),
	browser: v.nullable(v.string()),
	os: v.nullable(v.string()),
	cpu: v.nullable(v.string()),
	engine: v.nullable(v.string()),
	referrer: v.nullable(v.string()),
	visited_at: isoDate,
})

export type Visit = v.InferOutput<typeof visitSchema>