import { generateHead, generateShortlinkInfo, generateFooter } from "@j0code/shortlink-components"
import type { ShortlinkInfo, Visit } from "../db/schemas.ts"
import info from "../package_info.ts"
import config from "../config/config.ts"

const footer = generateFooter(info)

export default function userShortlinksPage(shortlinks: ShortlinkInfo[]) {
	const head = generateHead("inspect")
	//const shortlinkInfo = generateShortlinkInfo(config.baseUrl, shortlink, visits)
	console.log("shortlinks", shortlinks)

	return `
<!DOCTYPE html>
<html lang="en">
	${head}
	<body>
		<div id="card">
			<h1>My Shortlinks</h1>
			<main>
				
			</main>
			${footer}
		</div/
	</body>
</html>
	`.trim()
}