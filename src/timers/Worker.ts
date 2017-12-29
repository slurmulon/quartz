import { StartInterval, EndInterval } from '../Timer'
import * as workerTimers from 'worker-timers'

export const setInterval: StartInterval = (func: Function, wait: number) => {
  return workerTimers.setInterval(func, wait)
}

export const clearInterval: EndInterval = (interval) => {
  return workerTimers.clearInterval(interval)
}
