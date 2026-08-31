import config from "../config/config.ts"

const branding = config.branding

export function generateHead(jsModule: string) {
	return `
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="/css/main.css">
	<script type="module" src="/js/${jsModule}.js"></script>
	<title>${branding.name}</title>
</head>
	`.trim()
}