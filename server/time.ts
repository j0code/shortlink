export function isoDateToMs(isoDate: string | null): number | null {
	if (!isoDate) return null
	try {
		const instant = Temporal.Instant.from(isoDate)
		return instant.epochMilliseconds
	} catch {
		return null
	}
}

export function normalizeIsoDate(isoDate: string | null): string | null {
	if (!isoDate) return null
	try {
		const instant = Temporal.Instant.from(isoDate)
		const rounded = instant.round({ smallestUnit: "second", roundingMode: "floor" })
		return rounded.toString()
	} catch {
		return null
	}
}

export function now() {
	return Temporal.Now.instant().round({ smallestUnit: "second", roundingMode: "floor" }).toString()
}