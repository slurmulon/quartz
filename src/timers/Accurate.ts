import { SetInterval, ClearInterval } from '../Timer'
import now from 'performance-now'

export const setInterval: SetInterval = (func, wait) => {
  let action: (...args: any[]) => void
  let timeout: NodeJS.Timer //number
  let start: number = now()
  let next: number = start

  action = () => {
    const scheduled: number = next

    next += wait
    timeout = global.setTimeout(action, next - now())

    func(scheduled)
  }

  timeout = global.setTimeout(action, next - now())

  return timeout
}

export const clearInterval: ClearInterval = global.clearInterval
