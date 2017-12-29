import { StartInterval, EndInterval, Timer } from '../Timer'

export const setInterval: StartInterval = global.setInterval

export const clearInterval: EndInterval = global.clearInterval

export const setTimeout = global.setTimeout

export const clearTimeout = global.clearTimeout

// export const setInterval: StartInterval = window.setInterval

// export const clearInterval: EndInterval = window.clearInterval


// export const setInterval: StartInterval = setInterval
// export const clearInterval: EndInterval = clearInterval

// NOTE: when the default reference for `setInterval` etc. is used, we get a descriptive type description of `clearInterval`. could be the awy, but it breaks other stuff in `Accurate`
const timer: Timer = {
  setInterval, clearInterval,
  setTimeout, clearTimeout
}

export default timer
