export type Method = "GET" | "POST" | "DELETE"

export type Params = Record<string, string>

export type SuccessStatus = 200
export type ErrorStatus   = 400 | 401 | 403 |404 | 500

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