import * as v from "@valibot/valibot"
import { isoDate } from "@j0code/shortlink-api-types"

// required for (0 | 1) -> boolean type coercion
export const dbShortlinkSchema = v.object({
	id: v.string(),
	url: v.string(),
	owner_id: v.nullable(v.string()),
	restricted: v.pipe(v.union([v.literal(1), v.literal(0)]), v.toBoolean()),
	created_at: isoDate,
	expires_at: v.nullable(isoDate),
})

export const dbVisitCountSchema = v.object({
	count: v.number(),
})

export type DBVisitCount = v.InferInput<typeof dbVisitCountSchema>