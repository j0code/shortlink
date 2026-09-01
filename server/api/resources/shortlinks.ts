import APIResource from "../APIResource.ts"
import * as v from "@valibot/valibot"
import { createShortlink, getShortlink } from "../../db/db.ts"
import { error, success } from "../types.ts"
import { generateId } from "../../ids.ts"
import type { User } from "../../db/schemas.ts"

export default class CreateShortlink extends APIResource {

	constructor() {
		super("/api/v0/shortlinks", ["POST"])
	}

	override post(body: unknown, _params: unknown, user: User | null) {
		const result = v.safeParse(schema, body)

		if (!result.success) {
			const summary = v.summarize(result.issues)
			
			return error("Invalid request body", 400, summary)
		}

		const url = result.output.url
		const user_id = result.output.claim ? user?.id ?? null : null
		const id = generateId(id => !!getShortlink(id))
		if (!id) {
			return error("Failed to generate unique id", 500)
		}

		createShortlink(id, url, user_id, result.output.expires_at)

		return success({ id })
	}

}

const schema = v.object({
	url: v.pipe(
		v.string(),
		v.url("Invalid URL"),
	),
	claim: v.boolean(),
	expires_at: v.nullable(v.pipe(
		v.string(),
		v.isoTimestamp(),
	))
})