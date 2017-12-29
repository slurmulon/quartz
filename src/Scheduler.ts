// @see https://github.com/cwilso/metronome/blob/master/js/metronome.js
// @see https://github.com/mmckegg/bopper/blob/master/index.js
// @see https://github.com/mohayonao/web-audio-scheduler/blob/master/src/WebAudioScheduler.js
// @see https://github.com/joeLepper/beat-scheduler/blob/master/index.js
//
// TODO:
//  - wrap `web-audio-scheduler` with custom `Scheduler` that integrates `request-interval`
//  - create Web Worker that runs original `setInterval`
//  - create abstract `Timer` API
//
//  OR
//
//  TODO:
//  - wrap `web-audio-scheduler` with custom `Scheduler` that integrates `worker-timers`
//  - ensure `worker-timers` uses `request-interval` behind the scenes instead of native
//  - create abstract `Timer` API

import WebAudioScheduler from 'web-audio-scheduler'

export interface Scheduler {
  init: Function
  play: Function
  stop: Function
  tempo: Function
}
