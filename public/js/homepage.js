import API from "./api.js"

const createForm = document.querySelector("#create-shortlink")

const api = new API(location.href)

createForm.addEventListener("submit", async event => {
	event.preventDefault()

	const formData = new FormData(createForm)
	
	const url = formData.get("url")

	console.log(Object.fromEntries(Array.from(formData.entries())))

	const result = await api.createShortlink(url)

	console.log(result)

	createForm.elements.result.value = new URL(result.result.id, api.baseUrl).href
})

createForm.elements.result.addEventListener("click", copyValue(createForm.elements.result))
createForm.elements.result.addEventListener("keydown", copyValueOnKey(createForm.elements.result))

function copyValue(outputElem) {
	return event => {
		event.preventDefault()
		navigator.clipboard.writeText(outputElem.value)
	}
}

function copyValueOnKey(outputElem) {
	const cv = copyValue(outputElem)
	return event => {
		if (event.code == "Space") {
			cv(event)
		}
	}
}