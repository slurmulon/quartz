import { StartInterval, EndInterval } from '../Timer'
import * as workerTimers from 'worker-timers'

export const setInterval: StartInterval = (func, wait) => {
  return workerTimers.setInterval(func, wait)
}

// export const clearInterval: EndInterval = (interval: NodeJS.Timer | number): void | number => {
// export const clearInterval: EndInterval = (interval: StartInterval) => {

export const clearInterval: EndInterval = (interval) => {
  if (typeof interval !== 'number') return

  return workerTimers.clearInterval(interval)
}
