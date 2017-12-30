import now from 'performance-now'

export const setInterval = (func, wait) => {
  let action
  let timeout
  let start = now()
  let next = start

  action = () => {
    const scheduled = next

    next += wait
    timeout = setTimeout(action, next - now())

    func(scheduled)
  }

  timeout = setTimeout(action, next - now())

  return timeout
}

export const clearInterval = (interval) => clearTimeout(interval)
