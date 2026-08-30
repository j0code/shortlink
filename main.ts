import { loadConfig } from "./config/config.ts"
import express from "express"
import homepage from "./pages/index.ts";

const config = await loadConfig()

console.log("CONFIG", config)

const app = express()

app.get("/", (_req, res) => {
	res.send(homepage)
	res.end(200)
})

app.use(express.static("public"))

app.listen(config.port, config.hostname, () => {
	console.log("INFO", `Listening on http://${config.hostname}:${config.port}`)
})