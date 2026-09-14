import * as v from "@valibot/valibot"
import { isoDate } from "../base.ts"

export const userSchema = v.object({
	id: v.string(),
	key: v.string(),
	created_at: isoDate
})

export type User = v.InferOutput<typeof userSchema>