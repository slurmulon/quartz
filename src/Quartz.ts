// @see https://github.com/mmckegg/bopper/blob/master/index.js
// @see https://github.com/cwilso/metronome/blob/master/js/metronome.js

import WebAudioScheduler from 'web-audio-scheduler'
import InlineWorker from 'inline-worker'
import WorkerTimer from './Worker'
import { Timer, Callback } from 'quartz'

export type Time = Date | number

export interface State {
  running: boolean
  duration: number
  increment: number
  bpm: number
  last: {
    to: number
    end: Time
  }
  step: {
    next: Time
    cursor: number
  }
}

// TODO: get `scheduler` (the main `while` loop) to run in a `WebWorker`
// TODO: play a dummy buffer before starting the scheduling
//  - https://github.com/cwilso/metronome/pull/15
// FIXME: change the context of this module so that it acts more like a generic `setInterval` instead of  more `WebAudioAPI` based like it is now
//  - need to retain use of Web Audio API regardless of flavor beecause that's how we establish accurate time
//  - consider renaming `beat` to `step`
//  - consider renaming `Quartz` to `Metronome`
// TODO: consider differentiating between Sequential and Lazy timers (lazy ~ `setInterval`, sequential ~ `WebAudioAPI`)

export class Quartz {
  action: Callback
  wait: number // how frequently to call scheduling function (in milliseconds)
  ahead: number
  speed: number
  unit: number // TODO: move to `metronome`
  interval: number // in seconds
  silent: boolean
  state: State
  context: AudioContext
  sched: WebAudioScheduler
  worker: InlineWorker //Worker

  constructor ({
    action,
    wait,
    ahead,
    speed,
    interval,
    unit = 1,
    tempo = 120.0,
    silent = false,
    timer = { setInterval, clearInterval }
  } : {
    action: Callback,
    wait: number,
    ahead: number,
    speed: number,
    interval: number,
    unit: number,
    tempo: number,
    silent: boolean,
    timer: Timer
  }) {
    this.action = action
    this.wait = wait
    this.ahead = ahead
    this.speed = speed // TODO: confirm the need for this
    this.interval = interval
    this.unit = unit
    this.silent = silent

    this.context = new AudioContext()

    this.sched = new WebAudioScheduler({
      context: this.context,
      timerAPI: timer,
      aheadTime: ahead,
      interval
    })

    this.state = {
      running: false,
      duration: 60 / tempo,
      increment: 0,
      bpm: tempo,
      last: {
        to: 0,
        end: 0
      },
      step: {
        next: 0,
        cursor: 0
      }
    }
  }

  // play silent buffer to unlock the audio
  // kick off the web worker timer
  init (): this {
    const buffer = this.context.createBuffer(1, 1, 22050)
    const node   = this.context.createBufferSource()

    node.buffer = buffer
    node.start(0)

    this.worker = WorkerTimer()
    this.worker.postMessage({ wait: this.wait })

    return this
  }

  // TODO: call this. check `this.repeat` to determine if it should loop (i.e. call `this.tick`)
  // TODO: call `this.tick`
  loop (event: Event) {
    const spb = 60 / this.speed

    this.state.step.next = this.unit * spb
    this.state.step.cursor++
  }

  play () {
    this.state.running = true
    this.sched.start(this.loop)
    this.worker.postMessage('start')
  }

  stop (reset?: boolean) {
    this.state.running = false
    this.sched.stop(reset)
    this.worker.postMessage('stop')
  }

  on (topic: string, action: Callback): this {
    this.sched.on(topic, action)

    return this
  }

  // FIXME: import WAS.Event interface, somehow. or use `any`
  // TODO: consider `cycleLength` and `preCycle`
  //  - @see https://github.com/mmckegg/bopper/blob/master/index.js#L161
  // tick (event: any, after: Callback = () => {}): void {
  //   const t0: number = event.playbackTime || 0
  //   const t1: number = t0 + event.args.duration

  //   this.sched.nextTick(t1, after)
  // }

  // @see https://github.com/cwilso/metronome/blob/master/js/metronome.js#L69
  schedule (): void {
    const { next } = this.state.step
    const current  = this.state.last.end as number
    const frame    = this.context.currentTime + this.ahead

    while (next < frame) {
      // TODO: possibly convert currentNote (this.state.step.cursor) into `currentBeat` or `beatAt`, something like that
      // this.sched.insert(current, next)
      this.sched.insert(current, this.schedule)
    }
  }

  getPositionAt (time: number): number {
    const delta: number = (this.state.last.end as number) - time

    return this.state.last.to - (delta / this.state.duration)
  }

  getTimeAt (position: number): number {
    const offset = this.position - position

    return this.context.currentTime - (offset * this.state.duration)
  }

  // getStepDuration (): number {

  // }

  // TODO: change to setter
  setTempo (tempo: number): this {
    const bps: number = tempo / 60
    const spb: number = 60 / tempo
    const rate: number = this.rate

    this.state.duration = spb
    this.state.increment = bps * rate
    this.state.bpm = tempo

    this.sched.emit('tempo', tempo)

    return this
  }

  // FIXME: actually set `this.speed`
  // TODO: change to setter
  setSpeed (multiplier: number): this {
    const factor: number = multiplier || 1
    const tempo: number  = this.state.bpm * factor

    return this.setTempo(tempo)
  }

  get position (): number {
    return this.getPositionAt(this.context.currentTime)
  }

  get rate (): number {
    return (1 / this.context.sampleRate) * 1024
  }

}
