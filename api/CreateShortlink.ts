import APIResource from "./APIResource.ts"
import * as v from "@valibot/valibot"
import { createShortlink, getShortlink } from "../db/db.ts"
import { error, success } from "./types.ts"
import { encodeBase64 } from "@std/encoding/base64"

export default class CreateShortlink extends APIResource {

	constructor() {
		super("/api/v0/shortlinks", ["POST"])
	}

	override post(body: unknown) {
		const result = v.safeParse(schema, body)

		if (!result.success) {
			const summary = v.summarize(result.issues)
			
			return error("Invalid request body", 400, summary)
		}

		const url = result.output.url
		let hash
		let found = false

		for (let i = 0; i < 3; i++) {
			hash = generateHash()
			const existing = getShortlink(hash)
			if (!existing) {
				found = true
				break
			}
		}
		if (!found) {
			return error("Failed to generate unique hash", 500)
		}

		console.log(url, hash)

		createShortlink(hash!, url)
		const shortlink = getShortlink(hash!)

		console.log(shortlink)

		return success({ id: hash })
	}

}

const schema = v.object({
	url: v.pipe(
		v.string(),
		v.url("Invalid URL"),
	)
})

function generateHash(): string {
	const buffer = new Uint8Array(9)
	crypto.getRandomValues(buffer)
	return encodeBase64(buffer)
}