export async function getKey(password: string) {
	const pw = new TextEncoder().encode(password)
	const digest = await crypto.subtle.digest("sha-256", pw)
	return new Uint8Array(digest).toHex()
}