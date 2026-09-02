import type { ShortlinkInfo } from "../server/db/schemas.ts"
import ActionButton from "./ActionButton.ts"

export function UserShortlinksTable(shortlinks: ShortlinkInfo[]) {
	if (shortlinks.length === 0) {
		return `<p>No shortlinks yet.</p>`
	}

	const rows = shortlinks.map((shortlink) => {
		const targetUrl = new URL(shortlink.url)
		const shortTargetUrl = targetUrl.href.substring(targetUrl.protocol.length + 2)
		const buttons: string[] = []

		if (!isExpired(shortlink)) {
			buttons.push(ActionButton("search-code", "inspect-shortlink", { id: shortlink.id }))
		}
		buttons.push(ActionButton("trash-2", "delete-shortlink", { id: shortlink.id }))
		
		return `
<tr>
	<td>${shortlink.id}</td>
	<td>${shortTargetUrl}</td>
	<td><time datetime="${shortlink.expires_at ?? ""}" data-relative></time></td>
	<td>${shortlink.visitCount}</td>
	<td>
		<span class="action-buttons">${buttons.join("\n")}</span>
	</td>
</tr>
		`.trim()
	}).join("\n")

	return `
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Target URL</th>
			<th>Expires</th>
			<th>Visit Count</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		${rows}
	</tbody>
</table>
	`.trim()
}

function isExpired(shortlink: ShortlinkInfo): boolean {
	if (!shortlink.expires_at) {
		return false
	}

	const now = Temporal.Now.zonedDateTimeISO("UTC")
	const expireTime = Temporal.ZonedDateTime.from(`${shortlink.expires_at}[UTC]`)
	const diff = now.until(expireTime, { largestUnit: 'year', smallestUnit: 'second' })
	return diff.sign === -1
}