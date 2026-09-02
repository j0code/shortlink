import APIResource from "../APIResource.ts"
import { deleteShortlink, getShortlinkInfo } from "../../db/db.ts"
import { error, success } from "../types.ts"
import type { Params } from "../types.ts"
import type { User } from "../../db/schemas.ts"

export default class GetShortlink extends APIResource {

	constructor() {
		super("/api/v0/shortlinks/:id", ["GET", "DELETE"])
	}

	override get(_body: unknown, params: Params, user: User | null) {
		const info = getShortlinkInfo(params.id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		if (info.restricted && (!user || user.id !== info.owner_id)) {
			if (!user) {
				return error("Unauthenticated", 401)
			}

			if (user.id !== info.owner_id) {
				return error("Unauthorized", 403)
			}
		}

		return success(info)
	}

	override delete(_body: unknown, params: Params, user: User | null) {
		const info = getShortlinkInfo(params.id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		if (!user) {
			return error("Unauthenticated", 401)
		}

		if (user.id !== info.owner_id) {
			return error("Unauthorized", 403)
		}

		deleteShortlink(params.id)

		return success(info)
	}

}