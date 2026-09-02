import API, { getKey } from "@j0code/shortlink-api"
import { installCopyEventListeners } from "./copyable.ts"

const createForm  = document.querySelector("#create-shortlink")  as HTMLFormElement
const inspectForm = document.querySelector("#inspect-shortlink") as HTMLFormElement
const loginForm = document.querySelector("#login") as HTMLFormElement | null
const shortlinksButton = document.querySelector("#shortlinks-button") as HTMLButtonElement | null
const logoutButton = document.querySelector("#logout-button") as HTMLButtonElement | null

const api = new API(location.href)

createForm.addEventListener("submit", async event => {
	event.preventDefault()

	const formData = new FormData(createForm)
	const url = formData.get("url") as string
	const expires = formData.get("expires") as string
	const expiresAt = expires === "never" ? null : Temporal.Now.zonedDateTimeISO().add(Temporal.Duration.from(expires)).toInstant()
	const result = await api.createShortlink(url, true, expiresAt)

	if (!result.success) {
		alert(`${result.error}\n${result.details}`)
		return
	}

	const shortlinkOutput   = createForm.elements.namedItem("shortlink")   as HTMLInputElement
	const shortlinkIdOutput = createForm.elements.namedItem("shortlinkId") as HTMLInputElement

	shortlinkOutput.value   = new URL(result.result.id, api.baseUrl).href
	shortlinkIdOutput.value = result.result.id
})

inspectForm.addEventListener("submit", event => {
	event.preventDefault()

	const formData = new FormData(inspectForm)
	const id = formData.get("id") as string

	location.href = `/inspect/${id}`
})

loginForm?.addEventListener("submit", async event => {
	event.preventDefault()

	const formData = new FormData(loginForm)
	let id = formData.get("id") as string
	const password = formData.get("password") as string
	const key = await getKey(password)
	const idInput = loginForm.elements.namedItem("id") as HTMLInputElement

	if (!id) {
		const result = await api.createUser(password)
		if (!result.success) {
			alert(`${result.error}\n${result.details}`)
			return
		}

		id = result.result.id
	}

	setCookies(id, key)
	idInput.value = id
	
	location.reload()
})

shortlinksButton?.addEventListener("click", () => {
	location.href = "/users/@me/shortlinks"
})

logoutButton?.addEventListener("click", () => {
	document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
	document.cookie = "auth_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
	location.reload()
})

function setCookies(id: string, key: string) {
	const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
	document.cookie = `user_id=${id}; expires=${expires.toUTCString()}; path=/`
	document.cookie = `auth_key=${key}; expires=${expires.toUTCString()}; path=/`
}

installEventListeners()
console.log("cookies", document.cookie)

globalThis.api = api