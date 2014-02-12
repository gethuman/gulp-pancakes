# gulp-pancakes
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status](coveralls-image)](coveralls-url) [![Dependency Status][depstat-image]][depstat-url]

> pancakes plugin for [gulp](https://github.com/wearefractal/gulp)

**Please note that this plugin is still in development along with all of the Pancakes.js framework and should not be used quite yet.**


## Usage

First, install `gulp-pancakes` as a development dependency:

```shell
npm install --save-dev gulp-pancakes
```

Then, add it to your `gulpfile.js`:

```javascript
var pancakes = require("gulp-pancakes");

gulp.src("./src/*.ext")
	.pipe(pancakes({
		msg: "Hello Gulp!"
	}))
	.pipe(gulp.dest("./dist"));
```

## API

### pancakes(options)

#### options.msg
Type: `String`  
Default: `Hello World`

The message you wish to attach to file.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-pancakes
[npm-image]: https://badge.fury.io/js/gulp-pancakes.png

[travis-url]: http://travis-ci.org/gethuman/gulp-pancakes
[travis-image]: https://secure.travis-ci.org/gethuman/gulp-pancakes.png?branch=master

[coveralls-url]: https://coveralls.io/r/gethuman/gulp-pancakes
[coveralls-image]: https://coveralls.io/repos/gethuman/gulp-pancakes/badge.png

[depstat-url]: https://david-dm.org/gethuman/gulp-pancakes
[depstat-image]: https://david-dm.org/gethuman/gulp-pancakes.png
