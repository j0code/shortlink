import info from "../package_info.ts"
import config from "../config/config.ts"
import CreateShortlinkForm from "../components/CreateShortlinkForm.ts"
import InspectShortlinkForm from "../components/InspectShortlinkForm.ts"
import { generateHead } from "../components/Head.ts"

const branding = config.branding

const page = `
<!DOCTYPE html>
<html lang="en">
${generateHead("home")}
<body>
	<main>
		<h1>${branding.name}</h1>
		<div class="divider"></div>
		${CreateShortlinkForm}
		<div class="divider"></div>
		${InspectShortlinkForm}
	</main>
</body>
</html>
`.trim()

export default page