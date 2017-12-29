import { StartInterval, EndInterval } from '../Timer'
import now from 'performance-now'
// import present from 'present'

export const setInterval: StartInterval = (func: Function, wait: number) => {
  let action: Function
  let timeout: number
  let start: number = now()
  let next: number = start

  action = () => {
    const scheduled: number = next

    next += wait
    timeout = setTimeout(action, next - now())

    func(scheduled)
  }

  timeout = setTimeout(action, next - now())

  return timeout
}

export const clearInterval: EndInterval = (interval) => clearTimeout(interval)
