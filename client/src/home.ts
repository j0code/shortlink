import API from "./api.ts"
import "./copyable.ts"

const createForm  = document.querySelector("#create-shortlink")  as HTMLFormElement
const inspectForm = document.querySelector("#inspect-shortlink") as HTMLFormElement

const api = new API(location.href)

createForm.addEventListener("submit", async event => {
	event.preventDefault()

	const formData = new FormData(createForm)
	const url = formData.get("url") as string
	const expires = formData.get("expires") as string
	const expiresAt = expires === "never" ? null : Temporal.Now.zonedDateTimeISO().add(Temporal.Duration.from(expires)).toInstant()
	const result = await api.createShortlink(url, expiresAt)

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