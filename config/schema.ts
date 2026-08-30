import * as v from "@valibot/valibot"

export type Config = {
	port: number,
	hostname: string,
	branding: {
		name: string
	},
	baseUrl: string
}

const initial: Config = {
	port: 3000,
	hostname: "127.0.0.1",
	branding: {
		name: "Shortlink"
	},
	baseUrl: "http://localhost:3000"
}

const ConfigSchema = v.looseObject({
	port: v.optional(v.number(), initial.port),
	hostname: v.optional(v.string(), initial.hostname),
	branding: v.optional(v.looseObject({
		name: v.optional(v.string(), initial.branding.name)
	}), initial.branding),
	baseUrl: v.optional(v.pipe(v.string(), v.url()), initial.baseUrl)
})

export function parse(obj: unknown) {
	return v.safeParse(ConfigSchema, obj)
}