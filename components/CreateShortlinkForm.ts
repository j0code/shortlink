const CreateShortlinkForm = `
<form id="create-shortlink" autocomplete="off">
	<h3>Create new shortlink</h3>
	<label>
		URL: <input type="url" name="url" required>
	</label>
	<button>Create link!</button>
	<label>
		Shortlink: <output name="result" for="url" tabindex="0" title="Generated shortlink. Press space to copy." aria-live="polite"></output>
	</label>
</form>
`.trim()

export default CreateShortlinkForm