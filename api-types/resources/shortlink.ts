import * as v from "@valibot/valibot"
import { shortlinkInfoSchema } from "@j0code/shortlink-api-types"
import { emptySchema } from "../base.ts"

export const shortlinkGetRequestSchema = emptySchema
export const shortlinkGetResponseSchema = shortlinkInfoSchema

export const shortlinkDeleteRequestSchema = emptySchema
export const shortlinkDeleteResponseSchema = shortlinkInfoSchema