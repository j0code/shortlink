import config from "../config/config.ts"
import { CreateShortlinkForm, InspectShortlinkForm, generateHead, generateFooter } from "@j0code/shortlink-components"
import info from "../package_info.ts"

const footer = generateFooter(info)
const branding = config.branding

const page = `
<!DOCTYPE html>
<html lang="en">
${generateHead("home")}
<body>
	<div id="card">
		<h1>${branding.name}</h1>
		<main>
			<div class="divider"></div>
			${CreateShortlinkForm}
			<div class="divider"></div>
			${InspectShortlinkForm}
		</main>
		${footer}
	</div>
</body>
</html>
`.trim()

export default page