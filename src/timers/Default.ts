import { SetInterval, ClearInterval, EndNumericInterval, EndTimerInterval, Timer } from '../Timer'

export const setInterval: SetInterval = global.setInterval

export const clearInterval: ClearInterval = global.clearInterval
// export const clearInterval: EndNumericInterval = global.clearInterval

export const setTimeout = global.setTimeout

export const clearTimeout = global.clearTimeout

// export const setInterval: StartInterval = window.setInterval

// export const clearInterval: EndInterval = window.clearInterval


// export const setInterval: StartInterval = setInterval
// export const clearInterval: EndInterval = clearInterval

// NOTE: when the default reference for `setInterval` etc. is used, we get a detailed type description of `clearInterval`. could be the awy, but it breaks other stuff in `Accurate`
export const timer: Timer = {
  setInterval, clearInterval,
  setTimeout, clearTimeout
}

export default timer
