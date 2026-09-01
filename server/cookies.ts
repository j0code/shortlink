export type Cookies = Record<string, string>

export function parseCookieHeader(header: string | undefined): Cookies {
	if (!header) return {}

	const cookies: Cookies = {}
	const pairs = header.split(";")

	pairs.forEach(pair => {
		const split = pair.split("=")
		if (split.length != 2) return
		const [key, value] = split

		cookies[key.trimStart()] = value
	})

	return cookies
}