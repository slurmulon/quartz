import { SetInterval, ClearNumericInterval } from 'quartz'
import now from 'performance-now'
import raf from 'raf'

export const setInterval: SetInterval = (func, wait) => {
  let start: number = now()
  // let interval: number = raf(loop)
  let interval: NodeJS.Timer = raf(loop)

  function loop () {
    interval = raf(loop)

    if (now() - start >= wait) {
      func()

      start = now()
    }
  }

  return interval
}

export const clearInterval: ClearNumericInterval = (interval) => void raf.cancel(interval)
