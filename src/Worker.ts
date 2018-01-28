import { Timer, IntervalId } from 'quartz'
import Clock from './timers/Accurate'
import InlineWorker from 'inline-worker'

let interval: IntervalId | null
let wait: number = 100

const timer = (): IntervalId => setInterval(() => postMessage('tick', ''), wait)

// TODO: inherit custom interval from parent quartz object or just use `accurate-timer`
// const worker = (api: Timer = Clock) => new InlineWorker(self => {
const worker = () => new InlineWorker(self => {
  self.onmessage = event => {
    const { data } = event

    if (data === 'start') {
      interval = timer()
    } else if (data === 'stop') {
      clearInterval(interval as number)
      // api.clearInterval(interval as number)

      interval = null
    } else if (data.wait) {
      wait = data.wait

      if (interval) {
        clearInterval(interval as number)
        // api.clearInterval(interval as number)

        interval = timer()
      }
    }
  }
})

export default worker
