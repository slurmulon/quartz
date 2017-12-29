// export interface Timer {

//   setInterval (func: Function, interval: number): Function

//   clearInterval (interval: number): any

// }

export interface StartInterval {
  (func: Function, wait: number): Object
}

export interface EndInterval {
  (interval: number): void
}
