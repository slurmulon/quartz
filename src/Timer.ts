// export interface Timer {

//
//   setInterval (func: Function, interval: number): Function

//   clearInterval (interval: number): any

// }

export interface StartInterval {
  // (func: Function, wait: number): Object
  (func: (...args: any[]) => void, wait: number, ...args: any[]): NodeJS.Timer | number
  // (func: (...args: any[]) => void, wait: number, ...args: any[]): number

}

// TODO: eliminate the need for NodeJS.Timer in parameter
export interface EndInterval {
  // (interval: NodeJS.Timer | number): void | number
  // (interval: number): void
  //(interval: NodeJS.Timer): void // WORKS BEST
  // (interval: NodeJS.Timer | number): void | Timer
  // (interval: number): void | NodeJS.Timer

  (interval: NodeJS.Timer): void // progress
  // (interval: number): void // enabling both this line adn the above is very interesting (but breaks Default)

  // (interval: NodeJS.Timer | number): void
  
}

export interface Timer {
  setInterval: StartInterval
  clearInterval: EndInterval // TOOD (somehow): | global.clearInterval
  setTimeout?: Function
  clearTimeout?: Function
}
