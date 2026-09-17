import APIResource from "../APIResource.ts"
import { deleteShortlink, getShortlinkInfo } from "../../db/db.ts"
import { error, success } from "@j0code/shortlink-api-types"
import type { Params, ShortlinkInfo, User } from "@j0code/shortlink-api-types"
import { SHORTLINK } from "@j0code/shortlink-api-types/routes"
import { authError, authorized, type AuthState } from "../../auth.ts"

export default class ShortlinkResource extends APIResource<typeof SHORTLINK> {

	constructor() {
		super(SHORTLINK, ["GET", "DELETE"])
	}

	override get(_body: unknown, params: Params, user: User | null) {
		const info = getShortlinkInfo(params.id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		const { auth } = shortlinkReadPermission(info, user)
		if (auth != "Authorized") return authError(auth)

		return success(info)
	}

	override delete(_body: unknown, params: Params, user: User | null) {
		const info = getShortlinkInfo(params.id)

		if (!info) {
			return error("Shortlink not found", 404)
		}

		const { auth } = authorized(user, user => user.id == info.owner_id)
		if (auth != "Authorized") return authError(auth)

		deleteShortlink(params.id)

		return success(info)
	}

}

export function shortlinkReadPermission(info: ShortlinkInfo, user: User | null): AuthState | { auth: "Authorized", user: User | null } {
	if (!info.restricted) return { auth: "Authorized", user }
	return authorized(user, user => user.id == info.owner_id)
}