// @see https://github.com/Microsoft/TypeScript/issues/9229#issuecomment-226882914

// import { setInterval, clearInterval } from 'node'
// import * as node from '@types/node'
// import 'node'

declare module 'web-audio-scheduler' {

  // import Node = NodeJS.Global
  import Node = NodeJS
  import Quartz = require('quartz')

  class WebAudioScheduler implements Options, Emitter {
    context: AudioContext | Object
    interval: number
    aheadTime: number
    timerAPI: Timer
    _timerId: number
    _schedId: number
    _scheds: Array<Event>

    constructor (opts: Options)

    state (): string
    currentTime (): number
    events (): Array<Event>

    start (callback: Function, ...args: any[]): this
    stop (reset: boolean): WebAudioScheduler
    insert (time: number, callback: Function, ...args: any[]): number
    nextTick (time: number, callback: Function, ...args: any[]): number
    remove (schedId: number): number
    removeAll (): void
    process (t0: number, t1: number): void

    on (topic: string, cb: Function): void
    trigger (topic: string, data?: any): void
  }

  // interface Event {
  //   id: number
  //   time: number
  //   callback: Function
  //   args: Array<any>
  // }

  // FIXME: these need to be imported from Timer
  // interface SetInterval {
  //   (func: (...args: any[]) => void, wait: number, ...args: any[]): NodeJS.Timer | number
  // }

  interface ClearTimerInterval {
    (interval: NodeJS.Timer): void
  }

  interface ClearNumericInterval {
    (interval: number): void
  }

  type ClearInterval = ClearTimerInterval | ClearNumericInterval

  interface Timer {
    setInterval: Quartz.SetInterval
    clearInterval: ClearTimerInterval | ClearNumericInterval

    // TODO
    // setInterval: Node['setInterval']
    // clearInterval: Node['clearInterval']
  }

  interface Options {
    context?: AudioContext | Object
    interval?: number
    aheadTime?: number
    timerAPI?: Timer
  }

  interface Event {
    id: number
    time: number
    callback: Function
    args: Array<any> | Object
  }

  interface Emitter {
    on: (topic: string, cb: (data?: any) => void) => void
    trigger: (topic: string, data?: any) => void
  }

  // type Emitter = NodeJS.EventEmitter

  export = WebAudioScheduler

}
