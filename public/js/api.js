export default class API {

	baseUrl

	constructor(baseUrl) {
		this.baseUrl = baseUrl
	}

	createShortlink(url) {
		return post(this.baseUrl, "/api/v0/shortlinks", { url })
	}

}


function get(baseUrl, route) {
	const url = new URL(route, baseUrl)
	return fetch(url, {
		method: "GET",
	}).then(res => res.json())
}

function post(baseUrl, route, payload) {
	console.log("payload", payload)
	const url = new URL(route, baseUrl)
	return fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => res.json())
}