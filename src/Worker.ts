import { Timer, IntervalId } from 'quartz'
import { Quartz } from './Quartz'
import Clock from './timers/Accurate'
import InlineWorker = require('inline-worker')

let interval: IntervalId | null
let wait: number = 100

const timer = (worker: InlineWorker): IntervalId => setInterval(() => worker.postMessage('tick'), wait)

// TODO: move all of this into `Quartz.ts`. no point in having it separate.
// TODO: inherit custom interval from parent quartz object or just use `accurate-timer`
// const worker = (api: Timer = Clock) => new InlineWorker(self => {
// const worker = (quartz: Quartz) => { console.log('CREATED WORKER BRO'); return new InlineWorker(self => {
const worker = () => new InlineWorker(self => {
  console.log('~~~ inline worker', self)

  self.onmessage = event => {
    const { data } = event

    console.log('~~~ received arbitrary message', event)

    if (data === 'start') {
      interval = timer(self)
    } else if (data === 'stop') {
      clearInterval(interval as number)
      // api.clearInterval(interval as number)

      interval = null
    // } else if (data === 'tick') {
    //   quartz.schedule()
    } else if (data.wait) {
      wait = data.wait

      if (interval) {
        clearInterval(interval as number)
        // api.clearInterval(interval as number)

        interval = timer(self)
      }
    }
  }
})
// }, quartz)

export default worker
