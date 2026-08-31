import info from "../package_info.ts"

const Footer = `
<div id="footer">
	<a>${info.name} v${info.version}</a>
	<a>&lt;/&gt; with <3 by j0code</a>
	<a>${info.branch}/${info.commit.substring(0, 8)}</a>
</div>
`.trim()

export default Footer