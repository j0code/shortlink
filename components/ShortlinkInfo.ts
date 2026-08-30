import config from "../config/config.ts";
import type { Shortlink } from "../db/schemas.ts"

export function generateShortlinkInfo(shortlink: Shortlink) {
	const createdAt = new Date(shortlink.created_at)
	const shortlinkUrl = new URL(shortlink.id, config.baseUrl).toString()
	return `
<div class="shortlink-info">
	<p>Shortlink ID: <code class="copyable">${shortlink.id}</code></p>
	<p>Shortlink URL: <a href="${shortlinkUrl}" target="_blank" class="copyable">${shortlinkUrl}</a></p>
	<p>Target URL: <a href="${shortlink.url}" target="_blank" class="copyable">${shortlink.url}</a></p>
	<p>Created at: <time datetime="${createdAt.toISOString()}"></time></p>
</div>
	`.trim()
}