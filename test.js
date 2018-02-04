const run = require('tape-run')
const browserify = require('browserify')

browserify(__dirname + '/test/Quartz.spec.js')
  .bundle()
  .pipe(run())
  .on('results', console.log)
  .pipe(process.stdout)
