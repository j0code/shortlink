const CreateShortlinkForm = `
<form id="create-shortlink" autocomplete="off">
	<h3>Create new shortlink</h3>
	<label>
		URL: <input type="url" name="url" required>
	</label>
	<button>Create link!</button>
	<label>
		Shortlink: <output name="shortlink" for="url" aria-live="polite" class="copyable"></output>
	</label>
	<label>
		Shortlink ID: <output name="shortlinkId" for="url" aria-live="polite" class="copyable"></output>
	</label>
</form>
`.trim()

export default CreateShortlinkForm