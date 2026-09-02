import icons from "./icons.ts"

export function CopyableLink(url: string) {
	return `
<span class="copyable">${url}</span>
<span class="action-buttons">
	<a href="${url}" target="_blank" class="action-button">${icons["external-link"]}</a>
</span>
</span>
	`.trim()
}

export function CopyableOutputLink(url: string, name: string, forAttr: string) {
	return `
<output name="${name}" for="${forAttr}" aria-live="polite" class="copyable">${url}</output>
<span class="action-buttons">
	<a href="${url}" target="_blank" class="action-button">${icons["external-link"]}</a>
</span>
</span>
	`.trim()
}