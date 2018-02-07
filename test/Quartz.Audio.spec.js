const { Quartz } = require('../dist/Quartz')
const test = require('tape')

test('start', t => {
  // t.plan(1)

  const quartz = new Quartz({
    wait: 1000,
    action (event, next) {
      console.log('~~~ tick!', event)

      next()
    }
  }).start()

  setTimeout(() => {
    console.log('done')
    t.ok(true)
    t.end()
  }, 5000)
})
