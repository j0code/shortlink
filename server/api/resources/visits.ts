import APIResource from "../APIResource.ts"
import { getVisits } from "../../db/db.ts"
import { success } from "../types.ts"
import type { Params } from "../types.ts"

export default class GetShortlink extends APIResource {

	constructor() {
		super("/api/v0/shortlinks/:id/visits", ["GET"])
	}

	override get(_body: unknown, params: Params) {
		const visits = getVisits(params.id, 10)

		return success(visits)
	}

}