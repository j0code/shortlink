import config from "./config/config.ts"
import express from "express"
import homepage from "./pages/index.ts"
import { registerResources } from "./api/resources.ts"
import { getShortlink } from "./db/db.ts"

console.log("CONFIG", config)

const app = express()

app.use("/api", express.json())
registerResources(app)

app.get("/:id", async (req, res, next) => {
	const id = req.params.id
	const shortlink = getShortlink(id)

	if (!shortlink) {
		next()
		return
	}

	res.redirect(shortlink.url)
})

app.get("/", (_req, res) => {
	res.status(200).send(homepage)
})

app.use(express.static("public"))

app.listen(config.port, config.hostname, () => {
	console.log("INFO", `Listening on http://${config.hostname}:${config.port}`)
})