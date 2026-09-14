import * as v from "@valibot/valibot"

export type Method = "GET" | "POST" | "DELETE"
export type SuccessStatus = 200
export type ErrorStatus   = 400 | 401 | 403 |404 | 500

export type Params = Record<string, string>

export const isoDate = v.pipe(
	v.string(),
	v.isoTimestamp(),
)