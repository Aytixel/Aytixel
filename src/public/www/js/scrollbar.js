import { throttle } from "./util.js"

// Scrollbar

class ScrollBarElement extends HTMLElement {
  	constructor() {
		super()

		const parent_style = document.createElement("style")

		parent_style.textContent = `
			html::-webkit-scrollbar {
				display: none;
			}

			html {
				-ms-overflow-style: none;
				scrollbar-width: none;
			}
		`

		document.head.appendChild(parent_style)

		const shadow = this.attachShadow({ mode: "open" })
		const style = document.createElement("style")

		style.textContent = `
			:host {
				position: fixed !important;
				top: 0;
				right: 0;
				
				height: 100vh;
				width: 2vmax;
				
				cursor: pointer;
			}
			
			.placeholder {
				height: 100%;
				width: 100%;
				
				box-sizing: border-box;
				
				padding: calc(0.25vmax + 0.5vh) 0.75vmax;
				
				opacity: 0.85;
			}

			.placeholder::before {
				display: block;

				height: 100%;
				width: 100%;

				content: "";

				border-radius: 0.25vmax;

				background-color: ${this.getAttribute('bg-color')};
				
				opacity: 0;

				transition: 0.2s opacity ease-in-out;
			}

			.placeholder:hover::before {
				opacity: 0.45;
			}

			.track {
				position: relative;
				top: -100%;

				height: 100%;
				width: 100%;
			}

			.thumb {
				height: 10vmax;
				width: 0.5vmax;
				
				border-radius: 0.25vmax;
				
				background-color: ${this.getAttribute('color')};
				
				transition: 0.033s margin-top;
				
				opacity: 0.85;

				pointer-events: none;

				transition: 0.2s opacity ease-in-out;
			}

			.placeholder:hover .thumb {
				opacity: 1;
			}

			.test-rem {
				font-family: serif;
				font-size: 1rem;
			}
		`

		const placeholder = document.createElement("div")
		const track = document.createElement("div")
		const thumb = document.createElement("div")

		placeholder.classList.add("placeholder")
		track.classList.add("track")
		thumb.classList.add("thumb")
		
		track.appendChild(thumb)
		placeholder.appendChild(track)
		shadow.appendChild(placeholder)
		shadow.appendChild(style)

		// mouse & touch scroll
		const scroll_on = document.querySelector("html")
		const apply_mouse_scroll = e => {
			const scroll_progress = Math.min(track.clientHeight - thumb.clientHeight, Math.max(0, e.clientY - track.offsetTop - thumb.clientHeight / 2)) / (track.clientHeight - thumb.clientHeight)

			scroll_on.scrollTop = (scroll_on.scrollHeight - scroll_on.clientHeight) * scroll_progress
		}
		const start = e => {
			e.preventDefault()

			if (e.changedTouches) e = e.changedTouches[0]

			apply_mouse_scroll(e)

			window.addEventListener('mousemove', move)
			window.addEventListener('touchmove', move, { passive: false })
			window.addEventListener('mouseup', end)
			window.addEventListener('mouseleave', end)
			window.addEventListener('touchend', end)
			window.addEventListener('touchcancel', end)
			window.addEventListener('touchleave', end)
		}
		const move = throttle(e => {
			e.preventDefault()

			if (e.changedTouches) e = e.changedTouches[0]

			apply_mouse_scroll(e)
		}, 64)
		const end = e => {
			e.preventDefault()

			window.removeEventListener('mousemove', move)
			window.removeEventListener('touchmove', move)
			window.removeEventListener('mouseup', end)
			window.removeEventListener('mouseleave', end)
			window.removeEventListener('touchend', end)
			window.removeEventListener('touchcancel', end)
			window.removeEventListener('touchleave', end)
		}

		this.addEventListener('mousedown', start)
		this.addEventListener('touchstart', start, { passive: false })

		// update scrollbar position
		const update_scrollbar = () => {
			requestAnimationFrame(() => {
				const offset = window.pageYOffset / (document.body.clientHeight - window.innerHeight)
				
				thumb.style.transform = `translateY(${(track.clientHeight - thumb.clientHeight) * offset}px)`
			})
		}
		
		update_scrollbar()
		
		window.addEventListener('scroll', update_scrollbar)
		window.addEventListener('resize', update_scrollbar)
  	}
}

customElements.define("scroll-bar", ScrollBarElement, {})