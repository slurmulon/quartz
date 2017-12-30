import { SetInterval, ClearInterval, ClearNumericInterval } from '../Timer'
import * as workerTimers from 'worker-timers'

export const setInterval: SetInterval = (func, wait) => {
  return workerTimers.setInterval(func, wait)
}

export const clearInterval: ClearNumericInterval = (interval) => {
  return workerTimers.clearInterval(interval)
}
