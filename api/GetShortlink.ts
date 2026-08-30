import APIResource from "./APIResource.ts"
import { getShortlinkInfo } from "../db/db.ts"
import { error, success } from "./types.ts"
import type { Params } from "./types.ts"

export default class GetShortlink extends APIResource {

	constructor() {
		super("/api/v0/shortlinks/:id", ["GET"])
	}

	override get(_body: unknown, params: Params) {
		const id = typeof params.id === "string" ? params.id : params.id[0]
		const info = getShortlinkInfo(id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		return success(info)
	}

}