import APIResource from "../APIResource.ts"
import { getShortlinkInfo, getVisits } from "../../db/db.ts"
import { error, success } from "@j0code/shortlink-api-types"
import type { Params, User } from "@j0code/shortlink-api-types"
import { SHORTLINK_VISITS } from "@j0code/shortlink-api-types/routes"
import { shortlinkReadPermission } from "./shortlink.ts"
import { authError } from "../../auth.ts"

export default class ShortlinkVisitsResource extends APIResource<typeof SHORTLINK_VISITS> {

	constructor() {
		super(SHORTLINK_VISITS, ["GET"])
	}

	override get(_body: unknown, params: Params, user: User | null) {
		const info = getShortlinkInfo(params.id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		const { auth } = shortlinkReadPermission(info, user)
		if (auth != "Authorized") return authError(auth)

		const visits = getVisits(params.id, 10)

		return success(visits)
	}

}