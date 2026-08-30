import * as v from '@valibot/valibot'

export type Config = {
	port: number,
	hostname: string
}

const ConfigSchema = v.looseObject({
	port: v.optional(v.number(), 3000),
	hostname: v.optional(v.string(), "127.0.0.1")
})

export function parse(obj: unknown) {
	return v.safeParse(ConfigSchema, obj)
}