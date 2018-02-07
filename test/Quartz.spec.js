global.performance = { now: require('performance-now') }
global.Blob = require('blob')
global.Event = require('event')

const { Quartz } = require('../dist/Quartz')
const test = require('tape')

test('start', t => {
  const quartz = new Quartz({
    wait: 1000,
    action ({ state }) {
      console.log('state', state)
    }
  }).start()

  setTimeout(() => {
    quartz.stop()

    t.ok(quartz.state.total.time > 0)
    t.end()
  }, 1001)
})

test('stop', t => {
  const quartz = new Quartz({
    wait: 1000
  }).start()

  setTimeout(() => {
    const total = quartz.state.total.time

    quartz.stop()

    setTimeout(() => {
      const after = quartz.state.total.time

      t.ok(after === total)
      t.end()
    }, 100)
  }, 1001)
})
