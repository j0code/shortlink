import info from "../package_info.ts"
import config from "../config/config.ts"
import CreateShortlinkForm from "../components/CreateShortlinkForm.ts";

const branding = config.branding

const page = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="/css/main.css">
	<script type="module" src="/js/homepage.js"></script>
	<title>${branding.name}</title>
</head>
<body>
	<main>
		<h1>${branding.name}</h1>
		<div class="divider"></div>
		${CreateShortlinkForm}
		<div class="divider"></div>
	</main>
</body>
</html>
`.trim()

export default page