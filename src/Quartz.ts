import { TimingObject, ITimingObject } from 'timing-object'
import { Timer, IntervalId } from 'quartz'
// import TimingObject = require('timing-object')
// import { timingObjectConstructorFactory } from 'timing-object/src/timing-object-constructor-factory'
// const { TimingObject } = require('timing-object')

export interface Meta {
  last: number
  delta: number
  drift: number
  total: {
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
    this.timer = new TimingObject()
    this.meta = {
      last: 0,
      delta: 0,
      drift: 0,
      total: {
        drift: 0
      }
    }
  }

  play (meta?: boolean) {
    this.interval = this.api.setInterval(this.step, this.wait)
  }

  // FIXME: remove need for `as any`
  stop () {
    (this.api.clearInterval as any)(this.interval)
  }

  step () {
    const time  = this.timer.query().timestamp
    const delta = Math.abs(this.meta.last - time)
    const drift = delta - this.wait

    this.meta = { ...this.meta, ...{ last: time, delta, drift } }
    this.meta.total.drift += drift

    this.action(this)
  }

}
