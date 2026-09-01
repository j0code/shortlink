import config from "../config/config.ts"
import { CreateShortlinkForm, InspectShortlinkForm, LoginForm, UserInfo, generateHead, generateFooter } from "@j0code/shortlink-components"
import info from "../package_info.ts"
import { User } from "../db/schemas.ts"

const footer = generateFooter(info)
const branding = config.branding

export default function homepage(user: User | null = null) {
	const userArea = user ? UserInfo(user) : LoginForm

	return `
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
			<div class="divider"></div>
			${userArea}
		</main>
		${footer}
	</div>
</body>
</html>
`.trim()
}