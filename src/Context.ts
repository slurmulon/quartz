import now from 'performance-now'

export interface Context {

  currentTime: Function

}

export class DefaultContext {

  get currentTime () {
    return now() / 1000
  }

}
