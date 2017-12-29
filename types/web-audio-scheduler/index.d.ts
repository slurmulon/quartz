declare module 'web-audio-scheduler' {

  class WebAudioScheduler {
    context: Object
    interval: number
    aheadTime: number
    currentTime: number
    timerAPI: Timer
  }

  interface Timer {
    setInterval (func: Function, wait: number): Object
    clearInterval (interval: number): void
  }

}
