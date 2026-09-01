const LoginForm = `
<form id="login" autocomplete="on">
	<h3>Login</h3>
	<label>
		User ID: <input type="text" name="id" aria-describedby="user-id-hint">
	</label>
	<label>
		Password: <input type="password" name="password" required>
	</label>
	<small id="user-id-hint">Leave the User ID blank to create a new account.</small>
	<button>Login</button>
</form>
`.trim()

export default LoginForm