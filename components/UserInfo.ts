import { User } from "../server/db/schemas.ts"

export function UserInfo(user: User) {
	return `
<div id="user-info">
	<h3>Logged in</h3>
	<p>User ID: <strong class="copyable">${user.id}</strong></p>
	<div class="button-row">
		<button id="shortlinks-button">My shortlinks</button>
		<button id="logout-button">Logout</button>
	</div>
</div>
`.trim()
}