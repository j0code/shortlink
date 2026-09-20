import { generateHead, generateShortlinkInfo, generateFooter, NavBar } from "@j0code/shortlink-components"
import info from "../package_info.ts"
import config from "../config/config.ts"
import type { ShortlinkInfo, Visit } from "@j0code/shortlink-api-types"

const footer = generateFooter(info)

export default function inspectPage(shortlink: ShortlinkInfo, visits: Visit[]) {
	const head = generateHead("inspect")
	const shortlinkInfo = generateShortlinkInfo(config.baseUrl, shortlink, visits)
	console.log("shortlinkInfo", shortlink)

	return `
<!DOCTYPE html>
<html lang="en">
	${head}
	<body>
		<div id="card">
			${NavBar(["back", "home"])}
			<h1>Inspect Shortlink</h1>
			<main>
				<div class="divider"></div>
				${shortlinkInfo}
			</main>
			${footer}
		</div/
	</body>
</html>
	`.trim()
}