import { SetInterval, ClearInterval, ClearNumericInterval } from 'quartz'
import * as workerTimers from 'worker-timers'

export const setInterval: SetInterval = (func, wait) => workerTimers.setInterval(func, wait)

export const clearInterval: ClearNumericInterval = (interval) => workerTimers.clearInterval(interval)
