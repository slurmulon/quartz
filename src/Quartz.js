// TODO: take in `action`, generate `insert` statement(s)
export class Quartz {

  constructor (action, wait, speed, timer = { setInterval, clearInterval }) {
    this.action = action
    this.wait = wait
    this.speed = speed
    this.timer = timer
    this.active = false
    this.context = new AudioContext()
    this.clock = new WebAudioScheduler({ context: this.context, timerAPI: timer })
  }

  beat (event) {
    // TODO: consider speed
  }

  play () {
    this.clock.start(this.beat)

    return this
  }

  stop () {
    this.clock.stop()

    return this
  }

  tempo (speed) {
    this.speed = speed

    return this
  }

  on (topic, action) {
    this.clock.on(topic, action)

    return this
  }

  tick (event, action) {
    const t0 = event.playbackTime
    const t1 = t0 + event.args.duration

    this.clock.nextTick(t1, action)
  }

}
