import API, { getKey } from "@j0code/shortlink-api"
import { sanitizeLink, checkURLValidity } from "@j0code/shortlink-api/url"
import { installCopyEventListeners } from "./copyable.ts"
import { installNavbarListeners } from "./navbar.ts"

const createForm  = document.querySelector("#create-shortlink")  as HTMLFormElement
const inspectForm = document.querySelector("#inspect-shortlink") as HTMLFormElement
const loginForm = document.querySelector("#login") as HTMLFormElement | null
const shortlinksButton = document.querySelector("#shortlinks-button") as HTMLButtonElement | null
const logoutButton = document.querySelector("#logout-button") as HTMLButtonElement | null
const targetUrlPreview = createForm.elements.namedItem("target-url-preview") as HTMLOutputElement

const api = new API(location.href)

createForm.addEventListener("submit", async event => {
	event.preventDefault()

	const formData = new FormData(createForm)
	const url = safeURL(formData.get("url") as string)
	if (!url) return // TODO: display error
	const expires = formData.get("expires") as string
	const sanitize = formData.get("sanitize") == "on"
	const claim = formData.get("claim") == "on"
	const restricted = formData.get("restricted") == "on"
	const expiresAt = expires === "never" ? null : Temporal.Now.zonedDateTimeISO().add(Temporal.Duration.from(expires)).toInstant()
	const targetUrl = sanitize ? sanitizeLink(url) : url
	
	const result = await api.createShortlink(targetUrl.href, claim, restricted, expiresAt)

	if (!result.success) {
		alert(`${result.error}\n${result.details}`)
		return
	}

	const shortlinkUrl = new URL(`/${result.result.id}`, api.baseUrl).href
	const shortlinkOutput   = createForm.elements.namedItem("shortlink")   as HTMLInputElement
	const shortlinkIdOutput = createForm.elements.namedItem("shortlinkId") as HTMLInputElement
	const linkButton = shortlinkOutput.nextElementSibling!.children[0] as HTMLAnchorElement

	shortlinkOutput.value   = shortlinkUrl
	shortlinkIdOutput.value = result.result.id
	shortlinkOutput.tabIndex = 0
	shortlinkIdOutput.tabIndex = 0
	linkButton.href = shortlinkUrl
})

createForm.addEventListener("change", event => {
	const target = event.target as HTMLInputElement
	if (!["sanitize", "url"].includes(target.name)) return

	const formData = new FormData(createForm)
	const url = safeURL(formData.get("url") as string)
	const sanitize = formData.get("sanitize") == "on"

	if (!url) {
		targetUrlPreview.value = ""
		return
	}

	const { valid, message } = checkURLValidity(url)

	console.log(valid, message)

	if (target.name == "url") {
		target.setCustomValidity(message)
		target.reportValidity()
	}

	if (!valid) {
		targetUrlPreview.value = ""
		return
	}

	const targetUrl = sanitize ? sanitizeLink(url) : url
	targetUrlPreview.value = targetUrl.href
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

function safeURL(url: string) {
	url = url.trim()
	if (!url.startsWith("https://") && !url.startsWith("http://")) {
		url = `https://${url}`
	}

	try {
		const urlObj = new URL(url)
		return urlObj
	} catch {
		return null
	}
}

installCopyEventListeners()
installNavbarListeners()
console.log("cookies", document.cookie)

// @ts-ignore: debugging
globalThis.api = api