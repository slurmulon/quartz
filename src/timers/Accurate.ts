import { StartInterval, EndInterval } from '../Timer'
// import Timer from './Default'
import now from 'performance-now'

// export const setInterval: StartInterval = (func: Function, wait: number): NodeJS.Timer | number => {

export const setInterval: StartInterval = (func, wait) => {

// export const setInterval: StartInterval = (func: Function, wait: number): number => {
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

// FIXME: cast NodeJS.Timer into number
// export const clearInterval: EndInterval = (interval: NodeJS.Timer | number): void | number => void clearTimeout(interval as number)

export const clearInterval: EndInterval = (interval) => void global.clearTimeout(interval)

// export const clearInterval: EndInterval = (interval) => void clearTimeout(interval as number) // WORKS with default references
//
// export const clearInterval: EndInterval = (interval) => void Timer.clearTimeout(interval)
