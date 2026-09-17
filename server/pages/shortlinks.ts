import { generateHead, generateFooter, UserShortlinksTable } from "@j0code/shortlink-components"
import info from "../package_info.ts"
import type { ShortlinkInfo } from "@j0code/shortlink-api-types"

const footer = generateFooter(info)

export default function userShortlinksPage(shortlinks: ShortlinkInfo[]) {
	const head = generateHead("shortlinks")
	console.log("shortlinks", shortlinks)

	return `
<!DOCTYPE html>
<html lang="en">
	${head}
	<body>
		<div id="card" class="wide">
			<h1>My Shortlinks</h1>
			<main>
				${UserShortlinksTable(shortlinks)}
			</main>
			${footer}
		</div>
	</body>
</html>
	`.trim()
}