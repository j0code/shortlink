import Database from "better-sqlite3"
import { readFile, mkdir } from "node:fs/promises"
import * as v from "@valibot/valibot"
import { type Shortlink, type ShortlinkInfo, shortlinkSchema, type Visit, visitCountSchema, visitSchema } from "./schemas.ts"
import { DB_PATH, INIT_SQL_PATH, STORAGE_DIR } from "../constants.ts"
import { isoDateToMs, normalizeIsoDate, now } from "../time.ts"

const initSql = await readFile(INIT_SQL_PATH, "utf-8")
console.log("initSql", initSql)

await mkdir(STORAGE_DIR, { recursive: true })

const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.exec(initSql)

const queries = {
	insertShortlink: db.prepare("INSERT INTO shortlinks (id, url, created_at, expires_at) VALUES (@id, @url, @created_at, @expires_at)"),
	getShortlink: db.prepare("SELECT * FROM shortlinks WHERE id = @id"),
	insertVisit: db.prepare("INSERT INTO visits (shortlink_id, browser, os, cpu, engine, visited_at) VALUES (@shortlink_id, @browser, @os, @cpu, @engine, @visited_at)"),
	getVisits: db.prepare("SELECT * FROM visits WHERE shortlink_id = @shortlink_id ORDER BY visited_at DESC LIMIT @limit"),
	countVisits: db.prepare("SELECT COUNT(*) as count FROM visits WHERE shortlink_id = @shortlink_id"),
}

export function createShortlink(id: string, url: string, expires_at: string | null) {
	expires_at = normalizeIsoDate(expires_at)
	console.log("expires_at:", expires_at)
	queries.insertShortlink.run({ id, url, created_at: now(), expires_at })
}

export function getShortlink(id: string): Shortlink | null {
	const data = queries.getShortlink.get({ id })

	if (!data) {
		return null
	}

	const shortlink = parse(shortlinkSchema, "shortlink", data)
	if (!shortlink) {
		return null
	}

	const expiresAt = isoDateToMs(shortlink.expires_at)

	if (expiresAt && expiresAt < Date.now()) {
		return null
	}

	return shortlink
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
	queries.insertVisit.run({ shortlink_id, browser, os, cpu, engine, visited_at: now() })
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