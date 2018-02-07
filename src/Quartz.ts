import { TimingObject, ITimingObject } from 'timing-object'
import { Timer, IntervalId } from 'quartz'
import now = require('performance-now')

export interface Meta {
  last: number
  delta: number
  drift: number
  total: {
    time: number
    drift: number
  }
}

export class Quartz {
  timer: ITimingObject
  action: Function
  wait: number
  acceleration: number
  position: number
  velocity: number
  api: Timer
  interval: IntervalId | null
  meta: Meta

  constructor ({
    action,
    wait,
    acceleration = 1,
    position = 0,
    velocity = 1,
    api = { setInterval, clearInterval }
  } : {
    action: Function,
    wait: number,
    acceleration: number,
    position: number,
    velocity: number,
    api: Timer
  }) {
    this.action = action
    this.wait = wait
    this.acceleration = acceleration
    this.position = position
    this.velocity = velocity
    this.api = api
    this.timer = new TimingObject({ acceleration, position, velocity }) // TODO: consider last 2 args
    this.meta = {
      last: now(),
      delta: 0,
      drift: 0,
      total: {
        time: 0,
        drift: 0
      }
    }
  }

  start () {
    this.interval = this.api.setInterval(this.step.bind(this), this.wait)

    return this
  }

  // FIXME: remove need for `as any`
  stop () {
    const clear = this.api.clearInterval as any

    clear(this.interval)

    return this
  }

  step () {
    const { time, delta, drift } = this

    this.meta = { ...this.meta, ...{ last: time, delta, drift } }
    this.meta.total.time  += delta
    this.meta.total.drift += drift

    this.action(this)
  }

  get query () {
    return this.timer.query()
  }

  get time () {
    return this.query.timestamp
  }

  get delta () {
    return Math.abs(this.meta.last - this.query.timestamp)
  }

  get drift () {
    return this.delta - this.wait
  }

}
