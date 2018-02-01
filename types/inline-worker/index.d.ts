declare module 'inline-worker' {

  class InlineWorker {
    constructor (func: (worker: Worker) => void, self?: Object)

    postMessage (data: Object): void
    onmessage (event: Event): void
  }

  export = InlineWorker

}
