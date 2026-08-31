import Footer from "../components/Footer.ts"
import { generateHead } from "../components/Head.ts"
import { generateShortlinkInfo } from "../components/ShortlinkInfo.ts"
import type { ShortlinkInfo, Visit } from "../db/schemas.ts"

export default function generateInspectPage(shortlink: ShortlinkInfo, visits: Visit[]) {
	const head = generateHead("inspect")
	const shortlinkInfo = generateShortlinkInfo(shortlink, visits)
	console.log("shortlinkInfo", shortlink)

	return `
<!DOCTYPE html>
<html lang="en">
	${head}
	<body>
		<div id="card">
			<h1>Inspect Shortlink</h1>
			<main>
				${shortlinkInfo}
			</main>
			${Footer}
		</div/
	</body>
</html>
	`.trim()
}