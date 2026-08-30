import { generateHead } from "../components/Head.ts"
import { generateShortlinkInfo } from "../components/ShortlinkInfo.ts"
import type { ShortlinkInfo } from "../db/schemas.ts"

export default function generateInspectPage(shortlink: ShortlinkInfo) {
	const head = generateHead("inspect")
	const shortlinkInfo = generateShortlinkInfo(shortlink)

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