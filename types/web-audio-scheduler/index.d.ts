declare module 'web-audio-scheduler' {

  interface SchedulerOptions {
    context?: AudioContext | Object
    interval?: number
    aheadTime?: number
    timerAPI?: Timer
  }

  class WebAudioScheduler implements SchedulerOptions {
    context: AudioContext | Object
    interval: number
    aheadTime: number
    timerAPI: Timer
    _timerId: number
    _schedId: number
    _scheds: Array<Object>

    constructor (opts: SchedulerOptions)

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

  }

  interface Event {
    id: number
    time: number
    callback: Function
    args: Array<any>
  }

  interface Timer {
    setInterval (func: Function, wait: number): Object
    clearInterval (interval: number): void
  }

  export = WebAudioScheduler

}
