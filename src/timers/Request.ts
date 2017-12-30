// import { StartInterval, EndInterval } from '../Timer'
import { SetInterval, ClearInterval, EndNumericInterval } from '../Timer'
import now from 'performance-now'
import raf from 'raf'

export const setInterval: SetInterval = (func: Function, wait: number) => {
  let start: number = now()
  let interval: number = raf(loop)

  function loop () {
    interval = raf(loop)

    if (now() - start >= wait) {
      func()

      start = now()
    }
  }

  return interval
}

export const clearInterval: EndNumericInterval = (interval) => {
  raf.cancel(interval)
}
