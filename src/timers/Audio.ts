import { SetInterval, ClearNumericInterval, Timer } from 'quartz'
import * as audioTimers from 'audio-context-timers'

export const setInterval: SetInterval = audioTimers.setInterval

export const clearInterval: ClearNumericInterval = audioTimers.clearInterval

export const interval: Timer = { setInterval, clearInterval }

export default interval
