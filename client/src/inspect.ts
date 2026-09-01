import { installEventListeners } from "./copyable"

const timeElements = document.querySelectorAll("time")

timeElements.forEach(element => {
	element.innerText = element.dateTime ? new Date(element.dateTime).toLocaleString() : "Never"
})

installEventListeners()