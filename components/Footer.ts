type PackageInfo = {
	name:    string,
	version: string,
	commit:  string,
	branch:  string
}

export function generateFooter(info: PackageInfo) {
	return `
<footer>
	<a>${info.name} v${info.version}</a>
	<a>&lt;/&gt; with <3 by j0code</a>
	<a>${info.branch}/${info.commit.substring(0, 8)}</a>
</footer>
`.trim()
}