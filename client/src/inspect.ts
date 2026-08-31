import "./copyable.ts"

const timeElements = document.querySelectorAll("time")

timeElements.forEach(element => {
	element.innerText = new Date(element.dateTime).toLocaleString()
})