import API from "./api.js"
import "./copyable.js"

const createForm = document.querySelector("#create-shortlink")
const inspectForm = document.querySelector("#inspect-shortlink")

const api = new API(location.href)

createForm.addEventListener("submit", async event => {
	event.preventDefault()

	const formData = new FormData(createForm)
	const url = formData.get("url")
	const result = await api.createShortlink(url)

	createForm.elements.shortlink.value = new URL(result.result.id, api.baseUrl).href
	createForm.elements.shortlinkId.value = result.result.id
})

inspectForm.addEventListener("submit", event => {
	event.preventDefault()

	const formData = new FormData(inspectForm)
	const id = formData.get("id")

	location.replace(`/inspect/${id}`)
})