declare module 'quartz' {

  namespace Quartz {

    export type Callback = (...args: any[]) => void

    export interface SetInterval {
      (action: Callback, wait: number, ...args: any[]): NodeJS.Timer | number
    }

    export interface ClearNumericInterval {
      (interval: number): void
    }

    export interface ClearTimerInterval {
      (interval: NodeJS.Timer): void
    }

    export type ClearInterval = ClearNumericInterval | ClearTimerInterval

    export interface Timer {
      setInterval: SetInterval
      clearInterval: ClearInterval
      setTimeout?: Function // TODO: replace with native NodeJS types
      clearTimeout?: Function // TODO: replace with native NodeJS types
    }

  }

  export = Quartz

}
