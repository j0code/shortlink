import * as v from "@valibot/valibot"

export const shortlinkSchema = v.object({
	id: v.string(),
	url: v.string(),
	created_at: v.pipe(
		v.string(),
		v.isoDateTimeSecond(),
	),
})

export const visitSchema = v.object({
	shortlink_id: v.string(),
	browser: v.nullable(v.string()),
	os: v.nullable(v.string()),
	cpu: v.nullable(v.string()),
	engine: v.nullable(v.string()),
	visited_at: v.pipe(
		v.string(),
		v.isoDateTimeSecond(),
	),
})

export const visitCountSchema = v.object({
	count: v.number(),
})

export type Shortlink = v.InferInput<typeof shortlinkSchema>
export type Visit = v.InferInput<typeof visitSchema>
export type VisitCount = v.InferInput<typeof visitCountSchema>

export type ShortlinkInfo = Shortlink & {
	visitCount: number
	visits: Visit[]
}