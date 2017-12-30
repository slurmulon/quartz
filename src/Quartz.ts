import WebAudioScheduler from 'web-audio-scheduler'
import { Timer, Callback } from 'quartz'

export class Quartz {
  action: Callback
  wait: number
  speed: number
  active: boolean
  context: AudioContext
  clock: WebAudioScheduler

  constructor (action: Callback, wait: number, speed: number, timer: Timer = { setInterval, clearInterval }) {
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

  on (topic: string, action: Callback): this {
    this.clock.on(topic, action)

    return this
  }

  tick (event: any, after: Callback = () => {}) { // FIXME: import WAS.Event interface, somehow. or use `any`
    const t0 = event.playbackTime
    const t1 = t0 + event.args.duration

    this.clock.nextTick(t1, after)
  }
}
