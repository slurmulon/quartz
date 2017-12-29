import present from 'present'

export interface Context {

  currentTime: Function

}

export class DefaultContext {

  get currentTime () {
    return present() / 1000
  }

}
