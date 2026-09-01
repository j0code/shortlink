import * as v from "@valibot/valibot"

const isoDate = v.pipe(
	v.string(),
	v.isoTimestamp(),
)

export const userSchema = v.object({
	id: v.string(),
	key: v.string(),
	created_at: isoDate
})

export const shortlinkSchema = v.object({
	id: v.string(),
	url: v.string(),
	owner_id: v.nullable(v.string()),
	created_at: isoDate,
	expires_at: v.nullable(isoDate),
})

export const visitSchema = v.object({
	shortlink_id: v.string(),
	browser: v.nullable(v.string()),
	os: v.nullable(v.string()),
	cpu: v.nullable(v.string()),
	engine: v.nullable(v.string()),
	visited_at: isoDate,
})

export const visitCountSchema = v.object({
	count: v.number(),
})

export type User = v.InferInput<typeof userSchema>
export type Shortlink = v.InferInput<typeof shortlinkSchema>
export type Visit = v.InferInput<typeof visitSchema>
export type VisitCount = v.InferInput<typeof visitCountSchema>

export type ShortlinkInfo = Shortlink & {
	visitCount: number
}