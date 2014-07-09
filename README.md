# gulp-pancakes
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status](coveralls-image)](coveralls-url) [![Dependency Status][depstat-image]][depstat-url]

> pancakes plugin for [gulp](https://github.com/wearefractal/gulp)

This plugin works quite well with Pancakes for writing isomorphic JavaScript web apps,
but it is going to be rough trying this out yourself until I
get everything documented a little better. Working on it, though, and will try to updates this README
frequently as I make progress.

## Usage

First, install `gulp-pancakes` as a development dependency:

```shell
npm install --save-dev gulp-pancakes
```

Then, add it to your `gulpfile.js`:

```javascript
var pancakes = require("gulp-pancakes");

// must initialize pancakes first
pancakes.init({
    rootDir: __dirname,
    require: require,
    preload: ['utils']
});

// identify the transformer to be used
gulp.src(['app/**/*.js'])
    .pipe(pancakes({ transformer: 'app' })),
	.pipe(gulp.dest("./dist"));
```

There are two sets of options to be concerned about. The options for the init() and the options for each
pancakes transform call.

#### Pancakes Init Options

* rootDir (required) - This is typically set to __dirname but it should be the root dir of the project
* require (required) - This is typically just set to require. This allows the gulp plugin to use the project's require.
* preload - Directories to preload for dependency injection
* defaultTransformOptions - Default set of options used for all transform calls in the gulpfile. See section below.

#### Pancakes Transform Options

These options can and will change depending on what client side library you are using for transformations. For Angular,
here are some of the options we use at GetHuman:

* transformer (default 'basic') - The name of the transformer that will modify your code files. See the transformer notes below for more details.
* clientType - The type of client code you are working with
* ngPrefix - Angular-specific option. Used for angular directives as a prefix
* ngType - Angular-specific option. The type of Angular module you are creating.
* appName - Angular-specific option. The name of the app.

Unless you use the GH transformers, you will be writing your own transformers and thus customizing these options to meet your own needs.

## Transformers

The transformer does all the hard work to take a module which is in the isomorphic Pancakes format (node style) and
transform it into a client side module. We have not yet published a pre-packaged library of transformers because we
have found the transformation process to be very specific to the project you are working on. However, Pancakes does
contain the base foundation for transformers. So, in order to implement and use a transformer you would do the following:

1. Write a module in [Pancakes format](https://github.com/gethuman/pancakes).
2. Create a transformer that follows this format:

```javascript
// file called ng.myutil.transformer.js
module.exports = function (BaseTransformer, anotherDependency) {

    var MyUtilTransformer = function () {
        BaseTransformer.call(this, __dirname, 'ng.myutil');
    };

    _.extend(MyUtilTransformer.prototype, BaseTransformer.prototype);

    MyUtilTransformer.prototype.transform = function (originalModule, options) {
        var moduleName = options.moduleName;
        var dataForTransformation = {};

        // code to get data for transformation

        return this.template(dataForTransformation);
    }
}
```

3. Create a template file that follows the [doT.js format](http://olado.github.io/doT/index.html). For example:

```
// file called ng.myutil.template
angular.module('{{=it.appName}}').{{=it.ngType}}('{{=it.moduleName}}', [
    {{~it.convertedParams :param:index}}'{{=param}}', {{~}}
    function({{~it.params :param:index}}{{=param}}{{? index < (it.params.length - 1) }}, {{?}}{{~}}) {
        {{~it.ngrefs :param:index}}
        var {{=param}} = angular;
        {{~}}
        {{=it.body}}
    }
]);

```

4. Finally configure your gulpfile to send your test module through your transformer:

```javascript
var pancakes = require('gulp-pancakes');
var pancakesOpts = ;

pancakes.init({
    rootDir: __dirname,
    require: require,
    preload: ['utils'],
    defaultTransformOptions: {
        ngPrefix: 'gh',
        clientType: 'ng',
        ngType: 'factory',
        transformer: 'basic',
        appName: 'ghCommonApp'
    }
});

gulp.task('cookPancakes', function () {
    return gulp.src(['app/**/*.js'])
        .pipe(pancakes({ transformer: 'myutil' })),
        .pipe(gulp.dest("./dist"));
};
```

5. When you run `gulp cookPancakes` the transformed module should end up in your dist folder.


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
