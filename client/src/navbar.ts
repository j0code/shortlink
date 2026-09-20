import { $$ } from "./dom.ts"

export function installNavbarListeners() {
	const buttons = $$<HTMLButtonElement>(".navbar-button")

	console.log("buttons", Array.from(buttons).map(elem => elem.dataset.navbarTarget))

	buttons.forEach(button => {
		const target = button.dataset.navbarTarget
		if (!target || !(target in targets)) return

		if (target == "back" && !canGoBack()) {
			button.style.display = "none"
			return
		}

		const handler = targets[target as keyof typeof targets]

		button.addEventListener("click", handler)
		button.addEventListener("keyup", event => {
			if (event.code != "Space") return
			handler()
		})
	})
}

const targets = {
	back,
	home,
	user
}

function back() {
	history.back()
}

function home() {
	location.href = "/"
}

function user() {
	alert("Not implemented")
}

function canGoBack() {
	return document.referrer && (new URL(document.referrer)).origin == location.origin
}