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
		<main>
			<h1>Inspect Shortlink</h1>
			${shortlinkInfo}
		</main>
	</body>
</html>
	`.trim()
}