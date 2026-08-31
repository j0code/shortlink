import browserAPI, { isChrome } from "@bpev/bext"
import API from "@j0code/shortlink-api"
import { BASE_URL } from "./constants.ts"
import { generateFooter } from "@j0code/shortlink-components/footer"
import { installEventListeners } from "@j0code/shortlink-client/copyable"

const footer = generateFooter({
	name: "shortlink",
	version: "0.0.1",
	branch: "ext",
	commit: isChrome() ? "chrome" : "firefox"
})

const api = new API(BASE_URL)

const tab = (await browserAPI.tabs.query({
	active: true
}))[0]

const targetUrl = new URL(tab.url)
const body = document.body

if (["https:", "http:"].includes(targetUrl.protocol)) {
	main()
} else {
	renderError("Unable to generate shortlink", "This page is privileged and therefore cannot be shortened.")
}

async function main() {
	const response = await api.createShortlink(targetUrl.href)
	if (!response.success) {
		renderError(response.error, response.details + "")
		return
	}
	const shortlink = response.result
	const url = new URL(shortlink.id, BASE_URL)
	const inspectUrl = new URL(shortlink.id, `${BASE_URL}/inspect/`)

	renderPage(`
<div class="divider"></div>
<label>
	Shortlink: <output name="shortlink" for="url" aria-live="polite" class="copyable">${url}</output>
</label>
<label>
	Shortlink ID: <output name="shortlinkId" for="url" aria-live="polite" class="copyable">${shortlink.id}</output>
</label>
<div class="divider"></div>
<button id="inspect">Inspect</button>
	`.trim())

	const button = document.querySelector("#inspect")
	button?.addEventListener("click", event => {
		event.preventDefault()

		browserAPI.tabs.create({
			url: inspectUrl.href
		})
	})

	installEventListeners()

	navigator.clipboard.writeText(url.href)
}

function renderPage(content: string) {
	body.innerHTML = `
<div id="card">
	<h1>Shortlink</h1>
	<main>
		${content}
	</main>
	${footer}
</div>
	`.trim()

	const html = document.querySelector("html")!
	const card = document.querySelector("#card")!
	html.style.width  = `${card.clientWidth}px`
	html.style.height = `${card.clientHeight}px`
}

function renderError(error: string, details: string) {
	renderPage(`
		<div id="error-info">
			<h3 id="error">${error}</h3>
			<p id="details">${details.replaceAll("\n", "<br>")}<p>
		</div>
	`.trim())
}