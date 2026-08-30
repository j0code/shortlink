import YSON from "@j0code/yson"
import { access, writeFile } from "node:fs/promises"
import { Config, parse } from "./schema.ts"
import * as v from '@valibot/valibot'

const CONFIG_LOCATION = process.env.CONFIG_LOCATION || "./config.yson"

export async function loadConfig(): Promise<Config> {
	const raw = await readConfig()
	const result = parse(raw)

	if (!result.success) {
		const summary = v.summarize(result.issues)
		console.error("ERROR", `Config file at ${CONFIG_LOCATION} could not be parsed. See error below.`)
		console.error(summary)
		process.exit(1)
	}

	writeConfig(result.output)

	return result.output
}

async function readConfig(): Promise<unknown> {
	if (!(await exists(CONFIG_LOCATION))) {
		console.log("INFO", `No config file found at ${CONFIG_LOCATION}. Generating default config.`)
		return {}
	} else {
		try {
			return await YSON.load(CONFIG_LOCATION)
		} catch (e) {
			console.error("ERROR", `Config file at ${CONFIG_LOCATION} could not be parsed. See error below.`)
			console.error(e)
			process.exit(1)
		}
	}
}

async function writeConfig(config: Config) {
	const yson = YSON.stringify(config, {
		space: "\t"
	})

	try {
		await writeFile(CONFIG_LOCATION, yson, { encoding: "utf-8" })
	} catch (e) {
		console.error("ERROR", `Config could not be written back to ${CONFIG_LOCATION}. See error below.`)
		console.error(e)
	}
}

async function exists(path: string) {
	try {
		await access(path)
		return true
	} catch {
		return false
	}
}