import API from "./api.ts"
import "./copyable.ts"

const createForm  = document.querySelector("#create-shortlink")  as HTMLFormElement
const inspectForm = document.querySelector("#inspect-shortlink") as HTMLFormElement

const api = new API(location.href)

createForm.addEventListener("submit", async event => {
	event.preventDefault()

	const formData = new FormData(createForm)
	const url = formData.get("url") as string
	const result = await api.createShortlink(url)

	const shortlinkOutput = createForm.elements.namedItem("shortlink") as HTMLInputElement
	const shortlinkIdOutput = createForm.elements.namedItem("shortlinkId") as HTMLInputElement

	shortlinkOutput.value = new URL(result.result.id, api.baseUrl).href
	shortlinkIdOutput.value = result.result.id
})

inspectForm.addEventListener("submit", event => {
	event.preventDefault()

	const formData = new FormData(inspectForm)
	const id = formData.get("id") as string

	location.replace(`/inspect/${id}`)
})