import { throttle } from "./util.js"

// Menu

let menu = {
  menu: document.querySelector(".menu"),
  links: document.querySelectorAll(".menu .links a"),
  sections: [].slice.call(document.querySelectorAll(".body .section")),
}

const scroll_detection = () => {
  const scroll = window.pageYOffset

  menu.sections.slice().reverse().every((section) => {
    if (section.offsetTop - window.innerHeight / 2 <= scroll) {
      for (const link of menu.links) {
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

window.addEventListener("scroll", throttle(scroll_detection, 100))
