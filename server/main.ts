import config from "./config/config.ts"
import express from "express"
import homepage from "./pages/home.ts"
import inspectPage from "./pages/inspect.ts"
import { registerResources } from "./api/resources.ts"
import { getShortlink, getShortlinkInfo, getVisits, recordVisit } from "./db/db.ts"
import { UserAgent } from "@std/http/user-agent"
import { cookieAuth } from "./auth.ts"
import { parseCookieHeader } from "./cookies.ts"

console.log("CONFIG", config)

const app = express()

app.use("/api", express.json())
registerResources(app)

app.get("/", (req, res) => {
	res.status(200).send(homepage)

	const cookies = parseCookieHeader(req.headers.cookie)

	console.log("cookie:", cookies)
})

app.use("/js", express.static(config.clientJsPath))

app.get("/inspect/:id", (req, res) => {
	const { id } = req.params
	const info = getShortlinkInfo(id)
	const visits = getVisits(id, 10)


	if (!info) {
		res.status(404).send("Shortlink not found")
		return
	}

	res.status(200).send(inspectPage(info, visits))
})

app.get("/users/:id/shortlinks", (req, res) => {
	const { id } = req.params
	const user = cookieAuth(req.headers.cookie)

	if (!user) {
		res.status(401).send("Unauthenticated")
		return
	}

	if (id != "@me" && user.id != id) {
		res.status(403).send("Unauthorized")
		return
	}

	res.status(200).send(user)
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