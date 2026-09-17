import config from "./config/config.ts"
import express, { Response } from "express"
import homepage from "./pages/home.ts"
import inspectPage from "./pages/inspect.ts"
import { registerResources } from "./api/resources.ts"
import { getShortlink, getShortlinkInfo, getShortlinkInfosFor, getVisits, recordVisit } from "./db/db.ts"
import { UserAgent } from "@std/http/user-agent"
import { authorized, AuthType, cookieAuth } from "./auth.ts"
import userShortlinksPage from "./pages/shortlinks.ts"
import { shortlinkReadPermission } from "./api/resources/shortlink.ts"

console.log("CONFIG", config)

const app = express()

app.use("/api", express.json())
registerResources(app)

app.get("/", (req, res) => {
	const user = cookieAuth(req.headers.cookie)
	res.status(200).send(homepage(user))
})

app.use("/js", express.static(config.clientJsPath))

app.get("/inspect/:id", (req, res) => {
	const { id } = req.params
	const user = cookieAuth(req.headers.cookie)
	const info = getShortlinkInfo(id)

	if (!info) {
		res.status(404).send("Shortlink not found")
		return
	}

	const { auth } = shortlinkReadPermission(info, user)
	if (auth != "Authorized") {
		authError(auth, res)
		return
	}

	const visits = getVisits(id, 10)

	res.status(200).send(inspectPage(info, visits))
})

app.get("/users/:id/shortlinks", (req, res) => {
	const { id } = req.params

	const { auth, user } = authorized(cookieAuth(req.headers.cookie), user => id == "@me" || id == user.id)
	if (auth != "Authorized") {
		authError(auth, res)
		return
	}

	const shortlinks = getShortlinkInfosFor(user.id)

	res.status(200).send(userShortlinksPage(shortlinks))
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

function authError(auth: Exclude<AuthType, "Authorized">, res: Response) {
	switch (auth) {
		case "Unauthenticated":
			res.status(401).send("Unauthenticated")
			return
		case "Unauthorized":
			res.status(403).send("Unauthorized")
			return
	}
}