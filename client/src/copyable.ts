export function installEventListeners() {
	const copyables = document.querySelectorAll(".copyable") as NodeListOf<HTMLElement>

	copyables.forEach(copyable => {
		if (copyable.tagName != "A") copyable.addEventListener("click", copyValue(copyable))
		copyable.addEventListener("keydown", copyValueOnKey(copyable))

		copyable.tabIndex = 0
		copyable.title = "Press space to copy."
	})
}

function copyValue(outputElem: HTMLElement) {
	return (event: Event) => {
		event.preventDefault()
		const value = "value" in outputElem ? (outputElem as HTMLInputElement).value : outputElem.innerText
		navigator.clipboard.writeText(value)
	}
}

function copyValueOnKey(outputElem: HTMLElement) {
	const cv = copyValue(outputElem)
	return (event: KeyboardEvent) => {
		if (event.code == "Space") {
			cv(event)
		}
	}
}