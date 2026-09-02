import { ILLEGAL_IDS } from "./constants.ts"

export function generateId(exists: (id: string) => boolean, length: number = 12, tries: number = 3): string | null {
	for (let i = 0; i < tries; i++) {
		const id = randomId()
		const existing = exists(id)
		if (!existing && !isIllegalId(id)) {
			return id
		}
	}
	return null
}

function randomId(length: number = 12): string {
	const bits = length * 6
	const byteLength = Math.ceil(bits / 8)
	const buffer = new Uint8Array(byteLength)
	crypto.getRandomValues(buffer)
	return buffer.toBase64({ alphabet: "base64url" }).substring(0, length)
}

export function isIllegalId(id: string): boolean {
	for (const illegalId of ILLEGAL_IDS) {
		if (id.startsWith(illegalId)) {
			return true
		}
	}
	return false	
}