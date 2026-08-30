const copyables = document.querySelectorAll(".copyable")

copyables.forEach(copyable => {
	if (copyable.tagName != "A") copyable.addEventListener("click", copyValue(copyable))
	copyable.addEventListener("keydown", copyValueOnKey(copyable))

	copyable.tabIndex = 0
	copyable.title = "Press space to copy."
})

function copyValue(outputElem) {
	return event => {
		event.preventDefault()
		const value = outputElem.value ?? outputElem.innerText
		navigator.clipboard.writeText(value)
	}
}

function copyValueOnKey(outputElem) {
	const cv = copyValue(outputElem)
	return event => {
		if (event.code == "Space") {
			cv(event)
		}
	}
}