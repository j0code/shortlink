import icons from "./icons.ts"

export default function ActionButton(icon: keyof typeof icons, className: string, dataAttributes: Record<string, string> = {}) {
	const dataAttrs = Object.entries(dataAttributes).map(([key, value]) => `data-${key}="${value}"`).join(" ")
	
	return `
<button class="action-button ${className}" ${dataAttrs}>
	${icons[icon]}
</button>
	`.trim()
}