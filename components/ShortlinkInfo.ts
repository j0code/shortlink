import type { ShortlinkInfo, Visit } from "../server/db/schemas.ts"

export function generateShortlinkInfo(baseUrl: string, shortlink: ShortlinkInfo, visits: Visit[]) {
	const createdAt = new Date(shortlink.created_at).toISOString()
	const expiresAt = shortlink.expires_at ? new Date(shortlink.expires_at).toISOString() : null
	const shortlinkUrl = new URL(shortlink.id, baseUrl).toString()
	const expiresText = expiresAt ? `<time datetime="${expiresAt ?? ""}"></time> (<time datetime="${expiresAt ?? ""}" data-relative></time>)` : "Never"

	return `
<div class="shortlink-info">
	<p>Shortlink ID: <code class="copyable">${shortlink.id}</code></p>
	<p>Shortlink URL: <a href="${shortlinkUrl}" target="_blank" class="copyable">${shortlinkUrl}</a></p>
	<p>Target URL: <a href="${shortlink.url}" target="_blank" class="copyable">${shortlink.url}</a></p>
	<p>Created at: <time datetime="${createdAt}"></time></p>
	<p>Expires at: <span>${expiresText}</span></p>
	<p>Visit count: <code>${shortlink.visitCount}</code></p>
	<div class="divider"></div>
	<h2>Recent Visits</h2>
	${generateVisitsTable(visits)}
</div>
	`.trim()
}

function generateVisitsTable(visits: Visit[]) {
	if (visits.length === 0) {
		return `<p>No visits yet.</p>`
	}

	const rows = visits.map((visit) => `
		<tr>
			<td>${visit.visited_at}</td>
			<td>${visit.browser ?? "Unknown"}</td>
			<td>${visit.os ?? "Unknown"}</td>
			<td>${visit.cpu ?? "Unknown"}</td>
			<td>${visit.engine ?? "Unknown"}</td>
		</tr>
	`).join("\n")

	return `
<table>
	<thead>
		<tr>
			<th>Timestamp</th>
			<th>Browser</th>
			<th>OS</th>
			<th>CPU</th>
			<th>Engine</th>
		</tr>
	</thead>
	<tbody>
		${rows}
	</tbody>
</table>
	`.trim()
}	
