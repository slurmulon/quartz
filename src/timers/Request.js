import now from 'performance-now'
import raf from 'raf'

export const setInterval = (func, wait) => {
  let start = now()
  let interval = raf(loop)

  function loop () {
    interval = raf(loop)

    if (now() - start >= wait) {
      func()

      start = now()
    }
  }

  return interval
}

export const clearInterval = (interval) => {
  raf.cancel(interval)
}
