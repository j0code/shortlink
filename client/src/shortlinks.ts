import API from "@j0code/shortlink-api"
import { installCopyEventListeners } from "./copyable.ts"
import { evaluteTimeElements } from "./time.ts"

evaluteTimeElements()
installCopyEventListeners()
installEventListeners()

const api = new API(location.href)

export function installEventListeners() {
	const deleteButtons = document.querySelectorAll(".delete-shortlink") as NodeListOf<HTMLButtonElement>

	deleteButtons.forEach(button => {
		button.addEventListener("click", async () => {
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
		})
	})

	console.log("hey", deleteButtons)
}