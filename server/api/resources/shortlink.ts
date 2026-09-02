import APIResource from "../APIResource.ts"
import { deleteShortlink, getShortlinkInfo } from "../../db/db.ts"
import { error, success } from "../types.ts"
import type { Params } from "../types.ts"

export default class GetShortlink extends APIResource {

	constructor() {
		super("/api/v0/shortlinks/:id", ["GET", "DELETE"])
	}

	override get(_body: unknown, params: Params) {
		const info = getShortlinkInfo(params.id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		return success(info)
	}

	override delete(_body: unknown, params: Params) {
		const info = getShortlinkInfo(params.id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		deleteShortlink(params.id)

		return success(info)
	}

}