export default class API {

	baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	createShortlink(url: string) {
		return post(this.baseUrl, "/api/v0/shortlinks", { url })
	}

}


function get(baseUrl: string, route: string) {
	const url = new URL(route, baseUrl)
	return fetch(url, {
		method: "GET",
	}).then(res => res.json())
}

function post(baseUrl: string, route: string, payload: unknown) {
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