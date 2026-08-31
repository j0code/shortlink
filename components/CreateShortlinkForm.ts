const CreateShortlinkForm = `
<form id="create-shortlink" autocomplete="off">
	<h3>Create new shortlink</h3>
	<label>
		URL: <input type="url" name="url" required>
	</label>
	<label>
		Expires:
		<label>
			<input type="radio" name="expires" value="never" checked> Never
		</label>
		<label>
			<input type="radio" name="expires" value="P1D"> 1 Day
		</label>
		<label>
			<input type="radio" name="expires" value="P1W"> 1 Week
		</label>
		<label>
			<input type="radio" name="expires" value="P1Y"> 1 Year
		</label>
		<label>
			<input type="radio" name="expires" value="P3Y"> 3 Years
		</label>
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