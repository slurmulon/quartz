import * as workerTimers from 'worker-timers'

export const setInterval = (func, wait) => {
  return workerTimers.setInterval(func, wait)
}

export const clearInterval = (interval) => {
  return workerTimers.clearInterval(interval)
}
