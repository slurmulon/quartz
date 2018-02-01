// @see https://github.com/cwilso/metronome/blob/master/js/metronome.js
// @see https://github.com/mohayonao/web-audio-scheduler/blob/master/src/WebAudioScheduler.js
// @see https://github.com/mmckegg/bopper/blob/master/index.js
// @see https://github.com/sebpiq/WAAClock/blob/master/lib/WAAClock.js

// "In general, to be resilient to slower machines and operating systems, it’s best to have a large overall lookahead and a reasonably short interval"

import WebAudioScheduler = require('web-audio-scheduler')
import InlineWorker = require('inline-worker')
import WorkerTimer from './Worker'
import { AudioContext } from 'web-audio-api'
import { Timer, Callback } from 'quartz'

export type Time = Date | number

// TODO: consider `preCycle`..?
// @see: https://github.com/mmckegg/bopper/blob/master/index.js#L35
export interface State {
  running: boolean // whether or not the timer is running
  duration: number // how long to play each beat
  increment: number // FIXME: this seems entirely redundant
  tempo: number
  last: {
    to: number
    end: Time
  }
  step: {
    next: number // Time
    cursor: number // FIXME: actually integrate this beyond just incrementing... (https://github.com/cwilso/metronome/blob/master/js/metronome.js#L40)
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
  wait: number // how frequently to call scheduling function (in milliseconds). maybe rename to `freq` or `frequency`
  ahead: number // how far ahead to schedule audio (in seconds)
  // speed: number // TODO: make this redundant, replace with just `tempo`
  unit: number // TODO: move to `metronome`
  // interval: number // in seconds (NOT NEEDED)
  repeat: boolean
  silent: boolean
  state: State
  context: AudioContext
  scheduler: WebAudioScheduler
  worker: InlineWorker //Worker

  constructor ({
    action,
    wait,
    ahead,
    // speed,
    unit = 1,
    tempo = 120.0,
    silent = false,
    timer = { setInterval, clearInterval }
  } : {
    action: Callback,
    wait: number,
    ahead: number,
    // speed: number,
    // interval: number,
    unit: number,
    tempo: number,
    repeat: boolean,
    silent: boolean,
    timer: Timer
  }) {
    this.action = action
    this.wait = wait
    this.ahead = ahead
    // this.speed = speed // TODO: confirm the need for this
    this.unit = unit // TODO: confirm the need for this / where it came from...
    this.silent = silent

    this.context = new AudioContext()

    this.scheduler = new WebAudioScheduler({
      context: this.context,
      interval: this.rate,
      timerAPI: timer,
      aheadTime: ahead
    })

    this.state = {
      running: false,
      duration: 60 / tempo,
      increment: (tempo / 60) * this.rate,
      tempo,
      last: {
        to: 0,
        end: 0
      },
      step: {
        next: 0,
        cursor: 0
      }
    }

    this.init()
  }

  // play silent buffer to unlock the audio
  // kick off the web worker timer
  init (): this {
    // TODO: we should probably only do this if `this.silent` is `true`
    const buffer = this.context.createBuffer(1, 1, 22050 /* minimum sample rate */)
    const node   = this.context.createBufferSource()

    node.buffer = buffer
    node.start(0)

    this.worker = WorkerTimer(this)
    this.worker.postMessage({ wait: this.wait })
    this.worker.onmessage = event => {
      if ((event as any).data === 'tick') this.schedule()
    }
    // this.worker.onmessage = (event: Object) => console.log('received worker response', event)

    // const self = this
    // this.worker = new InlineWorker(function (self) {
    //   console.log('IT LIVESSSS')
    //   self.onmessage = event => {
    //     console.log('RECEIVED MESSAGE :D', event)
    //   }
    // }, self)
    // this.worker.postMessage('poop')

    // console.log('!!! initialized')

    return this
  }

  // LINK: `metronome` in `web-audio-scheduler` (https://github.com/mohayonao/web-audio-scheduler/blob/master/README.md)
  // TODO: call this. check `this.repeat` to determine if it should loop (i.e. call `this.tick`)
  loop (event: Event) {
    console.log('THIS STATE', this)
    const spb = 60 / this.state.tempo

    this.state.step.next = this.unit * spb
    this.state.step.cursor++

    // TODO: potentially call `schedule`. should be the same as tick, most likely. (@see https://github.com/cwilso/metronome/blob/master/js/metronome.js#L158)
    this.tick(event)
  }

  // TODO: figure out wtf this is about lol
  //  - https://github.com/mohayonao/web-audio-scheduler/blob/master/README.md
  //  - `function ticktac(e) {`
  //  - This function determines how long to play a now for. this is typically where the oscillator's audio is generated and played.
  // FIXME: import WAS.Event interface, somehow. or use `any`
  // TODO: consider `cycleLength` and `preCycle`
  //  - @see https://github.com/mmckegg/bopper/blob/master/index.js#L161
  tick (event: any): void {
    console.log('!!! tick event', event)
    const t0: number = event.playbackTime || 0
    const t1: number = t0 + (event.args ? event.args.duration : 0)

    // TODO: consider passing in `this.state` to `action`
    this.action(event, (next: Callback) => this.scheduler.nextTick(t1, next))
  }

  // LINK: https://github.com/cwilso/metronome/blob/master/js/metronome.js#L69
  // LINK: https://github.com/mohayonao/web-audio-scheduler/blob/master/src/WebAudioScheduler.js#L89 (calls `.insert` recursively)
  // LINK: https://github.com/mohayonao/web-audio-scheduler/blob/master/src/WebAudioScheduler.js#L118 (calls `.process`
  // TODO: determine when this should get called...
  // FIXME: may need to call `this.scheduler.nextTick` here... (@see usage in https://github.com/mohayonao/web-audio-scheduler/blob/master/README.md)
  // FIXME: I think this can just be completely replaced with `scheduler.nextTick`!
  schedule (): void {
    const { next } = this.state.step
    const { duration } = this.state
    const current = this.state.last.end as number
    const frame   = this.context.currentTime + this.ahead

    while (next < frame) {
      // TODO: possibly convert currentNote (this.state.step.cursor) into `currentBeat` or `beatAt`, something like that
      this.scheduler.insert(current, this.schedule, { duration })
    }
  }

  play () {
    this.state.running = true
    // this.schedule()
    this.scheduler.start(this.loop.bind(this))
    this.worker.postMessage('start')
  }

  stop (reset?: boolean) {
    this.state.running = false
    this.scheduler.stop(reset)
    this.worker.postMessage('stop')
  }

  on (topic: string, action: Callback): this {
    this.scheduler.on(topic, action)

    return this
  }

  getPositionAt (time: number): number {
    const delta = (this.state.last.end as number) - time

    return this.state.last.to - (delta / this.state.duration)
  }

  getTimeAt (position: number): number {
    const offset = this.position - position

    return this.context.currentTime - (offset * this.state.duration)
  }

  // TODO: change to setter
  setTempo (tempo: number): this {
    const bps: number = tempo / 60
    const spb: number = 60 / tempo
    const rate: number = this.rate

    this.state.duration = spb
    this.state.increment = bps * rate
    this.state.tempo = tempo

    this.scheduler.emit('tempo', tempo)

    return this
  }

  // FIXME: actually set `this.speed` (maybe, `speed` is probably redundant)
  // TODO: change to setter
  setSpeed (multiplier: number): this {
    const scale: number = multiplier || 1
    const tempo: number = this.state.tempo * scale

    return this.setTempo(tempo)
  }

  get position (): number {
    return this.getPositionAt(this.context.currentTime)
  }

  get rate (): number {
    return (1 / this.context.sampleRate) * 1024
  }

}
