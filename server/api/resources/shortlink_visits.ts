import APIResource from "../APIResource.ts"
import { getVisits } from "../../db/db.ts"
import { success } from "@j0code/shortlink-api-types"
import type { Params } from "@j0code/shortlink-api-types"
import { SHORTLINK_VISITS } from "@j0code/shortlink-api-types/routes"

export default class ShortlinkVisitsResource extends APIResource<typeof SHORTLINK_VISITS> {

	constructor() {
		super(SHORTLINK_VISITS, ["GET"])
	}

	override get(_body: unknown, params: Params) {
		const visits = getVisits(params.id, 10)

		return success(visits)
	}

}