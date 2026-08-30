import config from "../config/config.ts";
import type {  ShortlinkInfo } from "../db/schemas.ts"

export function generateShortlinkInfo(shortlink: ShortlinkInfo) {
	const createdAt = new Date(shortlink.created_at)
	const shortlinkUrl = new URL(shortlink.id, config.baseUrl).toString()
	console.log(shortlink)
	return `
<div class="shortlink-info">
	<p>Shortlink ID: <code class="copyable">${shortlink.id}</code></p>
	<p>Shortlink URL: <a href="${shortlinkUrl}" target="_blank" class="copyable">${shortlinkUrl}</a></p>
	<p>Target URL: <a href="${shortlink.url}" target="_blank" class="copyable">${shortlink.url}</a></p>
	<p>Created at: <time datetime="${createdAt.toISOString()}"></time></p>
	<p>Visits: <code>${shortlink.visits}</code></p>
</div>
	`.trim()
}