import * as v from "@valibot/valibot"
import { visitSchema } from "../entities/Visit.ts"

export const shortlinkVisitsResponseSchema = v.array(visitSchema)