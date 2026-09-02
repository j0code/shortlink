const units = ["years", "months", "days", "hours", "minutes", "seconds"]
const timeElements = document.querySelectorAll("time")

export function evaluteTimeElements() {
	timeElements.forEach(element => {
		let output: string
		if (element.hasAttribute("data-relative")) {
			output = relativeTime(element.dateTime)
		} else {
			output = element.dateTime ? new Date(element.dateTime).toLocaleString() : "Never"
		}
		element.innerText = output
	})
}

function relativeTime(datetime: string | null): string {
	if (!datetime) {
		return "Never"
	}

	const now = Temporal.Now.zonedDateTimeISO("UTC")
	const expireTime = Temporal.ZonedDateTime.from(`${datetime}[UTC]`)
	const diff = now.until(expireTime, { largestUnit: 'year', smallestUnit: 'second' })
	const expired = diff.sign === -1
	const absDiff = diff.abs()
	const unit = largestUnit(absDiff)

	const diffString = `${absDiff[unit]} ${unit}`

	if (expired) {
		return `Expired ${diffString} ago`
	} else {
		return `in ${diffString}`
	}
}

function largestUnit(diff: Temporal.Duration): keyof Temporal.Duration & string {
	let index = 0
	while (index < units.length) {
		const unit = units[index] as keyof Temporal.Duration & string
		if (diff[unit] !== 0) {
			return unit
		}
		index++
	}

	return "seconds"
}