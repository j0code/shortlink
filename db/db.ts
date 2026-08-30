import Database from "better-sqlite3"
import { readFile, mkdir } from "node:fs/promises"
import * as v from "@valibot/valibot"
import { type Shortlink, type ShortlinkInfo, shortlinkSchema, type Visit, visitCountSchema, visitSchema } from "./schemas.ts"

const initSql = await readFile("./queries/init.sql", "utf-8")
console.log("initSql", initSql)

await mkdir("./storage", { recursive: true })

const db = new Database("./storage/shortlinks.db")

db.pragma('journal_mode = WAL')
db.exec(initSql)

const queries = {
	insertShortlink: db.prepare("INSERT INTO shortlinks (id, url) VALUES (@id, @url)"),
	getShortlink: db.prepare("SELECT * FROM shortlinks WHERE id = @id"),
	insertVisit: db.prepare("INSERT INTO visits (shortlink_id, browser, os, cpu, engine) VALUES (@shortlink_id, @browser, @os, @cpu, @engine)"),
	getVisits: db.prepare("SELECT * FROM visits WHERE shortlink_id = @shortlink_id ORDER BY visited_at DESC LIMIT @limit"),
	countVisits: db.prepare("SELECT COUNT(*) as count FROM visits WHERE shortlink_id = @shortlink_id"),
}

export function createShortlink(id: string, url: string) {
	queries.insertShortlink.run({ id, url })
}

export function getShortlink(id: string): Shortlink | null {
	const data = queries.getShortlink.get({ id })

	if (!data) {
		return null
	}

	return parse(shortlinkSchema, "shortlink", data)
}

export function getShortlinkInfo(id: string): ShortlinkInfo | null {
	const shortlink = getShortlink(id)
	const visits = getVisits(id, 10)
	const visitCount = countVisits(id)

	if (!shortlink) {
		return null
	}

	return { ...shortlink, visits, visitCount }
}

export function recordVisit(shortlink_id: string, browser: string | null, os: string | null, cpu: string | null, engine: string | null) {
	queries.insertVisit.run({ shortlink_id, browser, os, cpu, engine })
}

export function getVisits(shortlink_id: string, limit: number): Visit[] {
	const data = queries.getVisits.all({ shortlink_id, limit })

	return data.map((row) => parse(visitSchema, "visit", row)).filter(visit => visit !== null)
}

export function countVisits(shortlink_id: string): number {
	const data = queries.countVisits.get({ shortlink_id })

	if (!data) {
		return 0
	}

	return parse(visitCountSchema, "visit count", data)?.count ?? 0
}

function parse<
	TEntries extends v.ObjectEntries,
	TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined
>(schema: v.ObjectSchema<TEntries, TMessage>, name: string, data: unknown) {
	const result = v.safeParse(schema, data)

	if (!result.success) {
		const summary = v.summarize(result.issues)
		console.error("ERROR", `Failed to parse ${name} from database:`, data)
		console.error(summary)
		return null
	}

	return result.output
}