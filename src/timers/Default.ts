// TODO: delete

import { SetInterval, ClearInterval, Timer } from 'quartz'

export const setInterval: SetInterval = global.setInterval
export const clearInterval: ClearInterval = global.clearInterval

export const setTimeout = global.setTimeout
export const clearTimeout = global.clearTimeout

export const interval: Timer = {
  setInterval, clearInterval,
  setTimeout,  clearTimeout
}

export default interval
