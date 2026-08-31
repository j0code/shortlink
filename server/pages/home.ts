import config from "../config/config.ts"
import CreateShortlinkForm from "../components/CreateShortlinkForm.ts"
import InspectShortlinkForm from "../components/InspectShortlinkForm.ts"
import { generateHead } from "../components/Head.ts"
import Footer from "../components/Footer.ts"

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
		${Footer}
	</div>
</body>
</html>
`.trim()

export default page