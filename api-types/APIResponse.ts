import type { ErrorStatus, SuccessStatus } from "./base.ts"
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