import { readFile } from "node:fs/promises"
import process from "node:process"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import { PROJECT_NAME } from "./constants.ts"

const execPromise = promisify(exec)
const cwd = process.cwd()

let denojson: unknown
let commit: string
let branch: string

try {
	const denojson_file = await readFile("./deno.json", { encoding: "utf-8" })
	denojson = JSON.parse(denojson_file)
	commit = await execAsync("git rev-parse HEAD")
	branch = await execAsync("git rev-parse --abbrev-ref HEAD")
} catch (e) {
	console.error("ERROR", "Could not read/parse package info. Corrupted installation? See error below.")
	console.error(e)
	process.exit(1)
}

if (typeof denojson != "object"
	|| !denojson
	|| !("name" in denojson)
	|| typeof denojson.name != "string"
	|| !("version" in denojson)
	|| typeof denojson.version != "string"
	|| commit.length < 8
	|| branch.length == 0
) {
	console.error("ERROR", "Could not read/parse package info. Corrupted installation?")
	process.exit(1)
}

export default {
	name:    PROJECT_NAME,
	version: denojson.version,
	commit:  commit,
	branch:  branch
}

async function execAsync(command: string): Promise<string> {
	const { stdout } = await execPromise(command, { cwd, encoding: "utf-8" })
	return stdout.trim()
}