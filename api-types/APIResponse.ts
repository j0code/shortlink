import { errorStatusSchema, successStatusSchema, type ErrorStatus, type SuccessStatus } from "./base.ts"
import * as v from "@valibot/valibot"

export type APIResponse<T = unknown> = {
	success: true,
	status: SuccessStatus
	result: T
} | {
	success: false,
	status: ErrorStatus,
	error: string,
	details?: unknown
}

export function success<T>(result: T, status: SuccessStatus = 200): APIResponse<T> {
	return { success: true, status, result }
}

export function error(message: string, status: ErrorStatus = 400, details?: unknown): APIResponse<never> {
	return { success: false, status, error: message, details }
}

const apiResponseSchema = v.variant("success", [
	v.object({
		success: v.literal(true),
		status: successStatusSchema,
		result: v.unknown()
	}),
	v.object({
		success: v.literal(false),
		status: errorStatusSchema,
		error: v.string(),
		details: v.optional(v.unknown())
	})
])

type ObjectSchema<
TEntries extends v.ObjectEntries = v.ObjectEntries,
TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined = v.ErrorMessage<v.ObjectIssue> | undefined
> = v.ObjectSchema<TEntries, TMessage>

type ParseResult<TSchema extends ObjectSchema> = {
	success: true,
	output: APIResponse<v.InferOutput<TSchema>>
} | {
	success: false,
	issues: [v.InferIssue<TSchema>, ...v.InferIssue<TSchema>[]]
}

export function parseAPIResponse<
TEntries extends v.ObjectEntries,
TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined
>(dataSchema: ObjectSchema<TEntries, TMessage>, res: unknown): ParseResult<typeof dataSchema> {
	const result = v.safeParse(apiResponseSchema, res)

	if (!result.success) {
		return { success: false, issues: result.issues }
	}

	const output = result.output
	
	if (!output.success) {
		return { success: true, output }
	}

	const { success, output: dataOutput, issues } = v.safeParse(dataSchema, output.result)

	if (!success) {
		return { success: false, issues}
	}

	return { success: true, output: {...output, result: dataOutput} }
}