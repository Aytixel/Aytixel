import { debounce } from "./util.js"

// Menu

const links = document.getElementsByClassName("menu")[0].getElementsByTagName("a")
const sections = [].slice.call(document.querySelectorAll(".body .section"))

const scroll_detection = () => {
	const scroll = window.pageYOffset

	sections.slice().reverse().every(section => {
		if (section.offsetTop - window.innerHeight / 2 <= scroll) {
			for (const link of links) {
				if (link.classList.toggle("hover", link.getAttribute("link") == section.getAttribute("id"))) {
					window.history.replaceState({}, " ", "#" + section.getAttribute("id"))
				}
			}

			return false
		}

		return true
	})
}

scroll_detection()

window.addEventListener("scroll", debounce(scroll_detection, 100))
