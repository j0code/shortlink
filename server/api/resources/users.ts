import APIResource from "../APIResource.ts"
import * as v from "@valibot/valibot"
import { error, success } from "@j0code/shortlink-api-types"
import { generateId } from "../../ids.ts"
import { createUser, getUser } from "../../db/db.ts"
import { USERS } from "@j0code/shortlink-api-types/routes"

export default class CreateShortlink extends APIResource {

	constructor() {
		super(USERS, ["POST"])
	}

	override post(body: unknown) {
		const result = v.safeParse(schema, body)

		if (!result.success) {
			const summary = v.summarize(result.issues)
			
			return error("Invalid request body", 400, summary)
		}

		const key = result.output.key
		const id = generateId(id => !!getUser(id))
		if (!id) {
			return error("Failed to generate unique id", 500)
		}

		createUser(id, key)

		return success({ id })
	}

}

const schema = v.object({
	key: v.pipe(
		v.string(),
		v.length(64),
		v.hexadecimal()
	)
})