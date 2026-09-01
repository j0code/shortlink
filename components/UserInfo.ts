import { User } from "../server/db/schemas.ts"

export function UserInfo(user: User) {
	return `
<div id="user-info">
	<h3>Logged in</h3>
	<p>User ID: <strong class="copyable">${user.id}</strong></p>
	<button id="logout-button" type="button">Logout</button>
</div>
`.trim()
}