import type { ShortlinkInfo } from "../server/db/schemas.ts"

export function UserShortlinksTable(shortlinks: ShortlinkInfo[]) {
	if (shortlinks.length === 0) {
		return `<p>No shortlinks yet.</p>`
	}

	const rows = shortlinks.map((shortlink) => {
		const targetUrl = new URL(shortlink.url)
		const shortTargetUrl = targetUrl.href.substring(targetUrl.protocol.length + 2)
		
		return `
<tr>
	<td>${shortlink.id}</td>
	<td>${shortTargetUrl}</td>
	<td>${shortlink.visitCount}</td>
	<td><time datetime="${shortlink.created_at}"></time></td>
	<td><time datetime="${shortlink.expires_at ?? ""}" data-relative></time></td>
	<td>
		<a href="/inspect/${shortlink.id}" target="_blank">Inspect</a>
		<button class="delete-shortlink" data-id="${shortlink.id}">Delete</button>
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
			<th>Visit Count</th>
			<th>Created At</th>
			<th>Expires</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		${rows}
	</tbody>
</table>
	`.trim()
}	