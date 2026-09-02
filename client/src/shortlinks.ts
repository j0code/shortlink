import API from "@j0code/shortlink-api"
import { installCopyEventListeners } from "./copyable.ts"
import { evaluteTimeElements } from "./time.ts"

evaluteTimeElements()
installCopyEventListeners()
installEventListeners(".delete-shortlink", deleteShortlink)
installEventListeners(".inspect-shortlink", inspectShortlink)

const api = new API(location.href)

export function installEventListeners(query: string, handler: (button: HTMLButtonElement) => void | Promise<void>) {
	const buttons = document.querySelectorAll(query) as NodeListOf<HTMLButtonElement>

	buttons.forEach(button => {
		button.addEventListener("click", () => handler(button))
	})
}

async function deleteShortlink(button: HTMLButtonElement) {
	if (confirm("Are you sure you want to delete this shortlink?")) {
		const id = button.dataset.id
		if (!id) {
			alert("No shortlink ID found.")
			return
		}
		const result = await api.deleteShortlink(id)
		if (result.success) {
			button.closest("tr")?.remove()
		} else {
			alert("Failed to delete shortlink:\n" + result.error)
		}
	}
}

function inspectShortlink(button: HTMLButtonElement) {
	const id = button.dataset.id
	if (!id) {
		alert("No shortlink ID found.")
		return
	}
	
	window.open(`/inspect/${id}`, "_blank", "noopener=true")
}