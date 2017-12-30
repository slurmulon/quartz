import { SetInterval, ClearInterval } from '../Timer'
import now from 'performance-now'

export const setInterval: SetInterval = (func, wait) => {
  let action: Function
  let timeout: number
  let start: number = now()
  let next: number = start

  action = () => {
    const scheduled: number = next

    next += wait
    timeout = window.setTimeout(action, next - now())

    func(scheduled)
  }

  timeout = window.setTimeout(action, next - now())

  return timeout
}

export const clearInterval: ClearInterval = global.clearInterval
