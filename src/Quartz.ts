// @see https://github.com/mmckegg/bopper/blob/master/index.js
// @see https://github.com/cwilso/metronome/blob/master/js/metronome.js

import WebAudioScheduler from 'web-audio-scheduler'
import { Timer, Callback } from 'quartz'

export type Time = Date | number

export interface State {
  playing: boolean
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
  wait: number
  ahead: number
  speed: number
  unit: number // TODO: move to `metronome`
  interval: number
  // active: boolean
  state: State
  context: AudioContext
  sched: WebAudioScheduler

  constructor (
    action: Callback,
    wait: number,
    ahead: number,
    speed: number,
    interval: number,
    unit: number = 1,
    timer: Timer = { setInterval, clearInterval }
  ) {
    this.action = action
    this.wait = wait
    this.ahead = ahead
    this.speed = speed
    this.interval = interval
    this.unit = unit

    this.context = new AudioContext()

    this.sched = new WebAudioScheduler({
      context: this.context,
      timerAPI: timer,
      aheadTime: ahead,
      interval
    })

    this.state = {
      playing: false,
      duration: 0.0,
      increment: 0,
      bpm: 120.0,
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

  init () {

  }

  loop (event: Event) {
    const spb = 60.0 / this.speed

    // this.state.nextNoteTime = this.unit * secondsPerBeat
    // this.state.currentNoteIndex++

    this.state.step.next = this.unit * spb
    this.state.step.cursor++
  }

  play () {
    this.state.playing = true
    this.sched.start(this.loop)
    // this.worker.postMessage('start')
  }

  stop (reset?: boolean) {
    this.state.playing = false
    this.sched.stop(reset)
    // this.worker.postMessage('stop')
  }

  // tempo (speed: number) {
  //   // const bps = tempo / number

  //   this.speed = speed
  // }

  on (topic: string, action: Callback): this {
    this.sched.on(topic, action)

    return this
  }

  tick (event: any, after: Callback = () => {}): void { // FIXME: import WAS.Event interface, somehow. or use `any`
    const t0: number = event.playbackTime || 0
    const t1: number = t0 + event.args.duration

    this.sched.nextTick(t1, after)
  }

  getPositionAt (time: number): number {
    const delta: number = (this.state.last.end as number) - time

    return this.state.last.to - (delta / this.state.duration)
  }

  getTimeAt (position: number): number {
    const offset = this.position - position

    return this.context.currentTime - (offset * this.state.duration)
  }

  // getCurrentPosition (): number {
  //   return this.getPositionAt(this.context.currentTime)
  // }

  // getBeatDuration (): number {

  // }

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

  setSpeed (multiplier: number): this {
    const factor: number = multiplier || 1 //Number.parseFloat(multiplier) || 0
    const tempo: number  = this.state.bpm * factor
    const bps: number = tempo / 60
    const spb: number = 60 / tempo

    this.state.duration  = spb
    this.state.increment = bps * this.rate

    this.sched.emit('speed', spb)

    return this
  }

  get position (): number {
    return this.getPositionAt(this.context.currentTime)
  }

  get rate (): number {
    return (1 / this.context.sampleRate) * 1024
  }

}
