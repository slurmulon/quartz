import { SetInterval, ClearInterval, ClearNumericInterval, Timer } from 'quartz'
import * as workerTimers from 'worker-timers'

export const setInterval: SetInterval = (func, wait) => workerTimers.setInterval(func, wait)

export const clearInterval: ClearNumericInterval = (interval) => workerTimers.clearInterval(interval)

export const interval: Timer = { setInterval, clearInterval }

export default interval
