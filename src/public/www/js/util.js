export function throttle(callback, delay) {
  let last, timer

  return function () {
    let context = this, now = +new Date(), args = arguments

    if (last && now < last + delay) {
      clearTimeout(timer)

      timer = setTimeout(() => {
        last = now
        callback.apply(context, args)
      }, delay)
    } else {
      last = now
      callback.apply(context, args)
    }
  }
}

export function debounce(callback, delay) {
  let timer

  return function () {
    let args = arguments, context = this

    clearTimeout(timer)

    timer = setTimeout(() => callback.apply(context, args), delay)
  }
}
