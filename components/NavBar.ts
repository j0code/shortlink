import { ActionButton } from "./ActionButton.ts"
import type icons from "./icons.ts"

export type NavBarButton = "back" | "home" | "user"

const iconMap = {
	"back": "arrow-left",
	"home": "house",
	"user": "circle-user"
} as Record<NavBarButton, keyof typeof icons>

type IconMap = typeof iconMap
const iconMapEntries = Object.entries(iconMap) as [keyof IconMap, IconMap[keyof IconMap]][]

export function NavBar(buttons: NavBarButton[]) {
	const buttonComps = []

	for (const [button, icon] of iconMapEntries) {
		if (buttons.includes(button)) {
			buttonComps.push(ActionButton(icon, "navbar-button", { navbarTarget: button }))
		}
	}

	return `
<div id="navbar" class="action-buttons">
	${buttonComps.join("\n")}
</div>
	`.trim()
}