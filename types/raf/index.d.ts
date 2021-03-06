declare module 'raf' {
  function raf (func: Function): number

  namespace raf {
    function cancel (...args: any[]): void
    function polyfill (object: Object): void
  }

  export = raf
}
