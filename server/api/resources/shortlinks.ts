import APIResource from "../APIResource.ts"
import * as v from "@valibot/valibot"
import { createShortlink, getShortlink } from "../../db/db.ts"
import { error, shortlinksPostRequestSchema, success, type User } from "@j0code/shortlink-api-types"
import { generateId } from "../../ids.ts"
import { SHORTLINKS } from "@j0code/shortlink-api-types/routes"

export default class ShortlinksResource extends APIResource<typeof SHORTLINKS> {

	constructor() {
		super(SHORTLINKS, ["POST"])
	}

	override post(body: unknown, _params: unknown, user: User | null) {
		const result = v.safeParse(shortlinksPostRequestSchema, body)

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

		createShortlink(id, url, user_id, result.output.restricted, result.output.expires_at)

		return success({ id })
	}

}