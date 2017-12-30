import { SetInterval, ClearInterval, Timer } from '../Timer'

export const setInterval: SetInterval = global.setInterval

export const clearInterval: ClearInterval = global.clearInterval

export const setTimeout = global.setTimeout

export const clearTimeout = global.clearTimeout

export const timer: Timer = {
  setInterval, clearInterval,
  setTimeout,  clearTimeout
}

export default timer
