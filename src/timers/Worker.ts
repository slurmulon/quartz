import { SetInterval, ClearInterval, ClearNumericInterval, Timer } from 'quartz'
import * as workerTimers from 'worker-timers'

export const setInterval: SetInterval = workerTimers.setInterval

export const clearInterval: ClearNumericInterval = workerTimers.clearInterval

export const interval: Timer = { setInterval, clearInterval }

export default interval
