# Research

## Approach

- http://catarak.github.io/blog/2014/12/02/web-audio-timing-tutorial/
- http://blog.wemakeawesomesh.it/synced-web-audio-playback/
- https://www.html5rocks.com/en/tutorials/audio/scheduling/
- https://www.npmjs.com/package/worker-timers
- https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution
- https://w3c.github.io/hr-time/
- https://www.sitepoint.com/syncing-css-animations-with-html5-audio/
- http://timpietrusky.com/dotjs2013/

## Performance

- https://jsfiddle.net/langdonx/EFKYt/ (compares all timers)
- http://chimera.labs.oreilly.com/books/1234000001552/ch02.html#s02_2
- http://catarak.github.io/blog/2014/12/02/web-audio-timing-tutorial/
- http://blog.sethladd.com/2011/09/box2d-web-workers-better-performance.html
- http://blog.wemakeawesomesh.it/synced-web-audio-playback/

## Tutorials

- http://catarak.github.io/blog/2014/12/02/web-audio-timing-tutorial/
- http://blog.wemakeawesomesh.it/synced-web-audio-playback/
- https://gist.github.com/mohayonao/6f7daddda053b975a705ce8437e434ce
- http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
- https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/

## Tech

- https://github.com/adamrenklint/dilla (`bopper` + `ditty`)
- https://github.com/cwilso/metronome/ (**good place to start**)
- https://www.npmjs.com/package/raf-schd

## Features

- Support groups of callbacks (that way not everything has to be defined in a massive callback with `if` or `switch` statements)
- Support tempo updates
- Either run `accurate-interval` or `Rolex` in the `web-worker-interval` and hope the adjustments work properly, OR run `request-interval` in the `web-worker-interval` and always lookup the latest step via the current timestamp, adjusted to the relative starting time
