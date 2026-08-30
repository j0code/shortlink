import Database from "better-sqlite3"
import { readFile, mkdir } from "node:fs/promises"
import * as v from "@valibot/valibot"
import { type Shortlink, shortlinkSchema } from "./schemas.ts"

const initSql = await readFile("./queries/init.sql", "utf-8")
console.log("initSql", initSql)

await mkdir("./storage", { recursive: true })

const db = new Database("./storage/shortlinks.db")

db.pragma('journal_mode = WAL')
db.exec(initSql)

const queries = {
	createShortlink: db.prepare("INSERT INTO shortlinks (id, url) VALUES (@id, @url)"),
	getShortlink: db.prepare("SELECT * FROM shortlinks WHERE id = @id")
}

export function createShortlink(id: string, url: string) {
	queries.createShortlink.run({ id, url })
}

export function getShortlink(id: string): Shortlink | null {
	const data = queries.getShortlink.get({ id })

	if (!data) {
		return null
	}

	const result = v.safeParse(shortlinkSchema, data)

	if (!result.success) {
		const summary = v.summarize(result.issues)
		console.error("ERROR", `Failed to parse shortlink from database for id ${id}:`, data)
		console.error(summary)
		return null
	}

	return result.output
}