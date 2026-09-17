import * as v from "@valibot/valibot"
import { visitSchema } from "../entities/Visit.ts"
import { emptySchema } from "../base.ts"

export const shortlinkVisitsGetRequestSchema = emptySchema
export const shortlinkVisitsGetResponseSchema = v.array(visitSchema)