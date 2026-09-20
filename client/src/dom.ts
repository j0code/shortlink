export function $<Element extends HTMLElement>(query: string) {
	return document.querySelector<Element>(query)
}

export function $$<Element extends HTMLElement>(query: string) {
	return document.querySelectorAll<Element>(query)
}