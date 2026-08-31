import config from "./config/config.ts"
import express from "express"
import homepage from "./pages/home.ts"
import inspectPage from "./pages/inspect.ts"
import { registerResources } from "./api/resources.ts"
import { getShortlink, getShortlinkInfo, recordVisit } from "./db/db.ts"
import { UserAgent } from "@std/http/user-agent"

console.log("CONFIG", config)

const app = express()

app.use("/api", express.json())
registerResources(app)

app.get("/", (_req, res) => {
	res.status(200).send(homepage)
})

app.use("/js", express.static(config.clientJsPath))

app.get("/inspect/:id", (req, res) => {
	const { id } = req.params
	const info = getShortlinkInfo(id)


	if (!info) {
		res.status(404).send("Shortlink not found")
		return
	}

	res.status(200).send(inspectPage(info))
})

app.get("/:id", (req, res, next) => {
	const ua = new UserAgent(req.headers["user-agent"] ?? "")
	const id = req.params.id
	const shortlink = getShortlink(id)

	if (!shortlink) {
		next()
		return
	}

	res.redirect(shortlink.url)
	recordVisit(id, ua.browser.name ?? null, ua.os.name ?? null, ua.cpu.architecture ?? null, ua.engine.name ?? null)
})

app.use(express.static("public"))

app.listen(config.port, config.hostname, () => {
	console.log("INFO", `Listening on http://${config.hostname}:${config.port}`)
})