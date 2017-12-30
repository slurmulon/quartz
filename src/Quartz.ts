import WebAudioScheduler from 'web-audio-scheduler'
// import { Timer } from './Timer'
import { Timer } from 'quartz'
import DefaultTimer from './timers/Default'

export class Quartz { //implements Scheduler {
  action: Function
  wait: number
  speed: number
  active: boolean
  context: AudioContext
  clock: WebAudioScheduler

  constructor (action: Function, wait: number, speed: number, timer: Timer = DefaultTimer) {
    this.action  = action
    this.wait    = wait
    this.speed   = speed
    this.active  = false
    this.context = new AudioContext()
    this.clock   = new WebAudioScheduler({ context: this.context, timerAPI: timer })
  }

  init () {

  }

  beat (event: Event) {
    // TODO: consider `speed`
  }

  play () {
    this.clock.start(this.beat)
  }

  stop () {

  }

  tempo (speed: number) {
    this.speed = speed
  }

  on (topic: string, action: Function): this {
    this.clock.on(topic, action)

    return this
  }

  tick (event: any, after: Function = () => {}) { // FIXME: import WAS.Event interface, somehow. or use `any`
    const t0 = event.playbackTime
    const t1 = t0 + event.args.duration

    this.clock.nextTick(t1, after)
  }
}
