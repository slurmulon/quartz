import { IntervalId } from 'quartz'
import InlineWorker from 'inline-worker'

let interval: IntervalId | null
let wait: number = 100

const timer = (): IntervalId => setInterval(() => postMessage('tick', ''), wait)

const worker = () => new InlineWorker(self => {
  self.onmessage = event => {
    const { data } = event

    if (data === 'start') {
      interval = timer()
    } else if (data === 'stop') {
      clearInterval(interval as number)

      interval = null
    } else if (data.wait) {
      wait = data.wait

      if (interval) {
        clearInterval(interval as number)

        interval = timer()
      }
    }
  }
})

export default worker
