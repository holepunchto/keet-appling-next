export function encode(msg) {
  return JSON.stringify(msg)
}

export function decode(msg) {
  return JSON.parse(msg.toString())
}

export function throttle(fn, ms = 100) {
  let timer = null
  return function (...args) {
    if (!timer) {
      fn.apply(this, args)
      timer = setTimeout(() => (timer = null), ms)
    }
  }
}
