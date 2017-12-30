export interface SetInterval {
  (func: (...args: any[]) => void, wait: number, ...args: any[]): NodeJS.Timer | number
}

// import Node = NodeJS.Global

// export type SetInterval = Node['setInterval'] // NodeJS.setInterval

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
  setTimeout?: Function
  clearTimeout?: Function
}
