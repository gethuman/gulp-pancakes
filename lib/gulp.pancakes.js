/**
 * This Gulp plugin will convert node modules that are built with the
 * Pancakes.js standards into client side modules
 */
var Q           = require('q');
var _           = require('lodash');
var through     = require('through2');
var	gutil       = require('gulp-util');
var pancakes;
var initOptions = {};

/**
 * Transform the module
 * @param gulpContext
 * @param file
 * @param options
 * @param next
 */
var transformModule = function (gulpContext, file, options, next) {

    // options are really the init options overrided by these specific transform options
    options = _.extend({}, initOptions.defaultTransformOptions, options);
    options.filePath = file.path;
    options.moduleName = pancakes.utils.getCamelCase(file.path);

    // get the original module and the appropriate transformer
    var originalModule = pancakes.requireModule(file.path, true);
    var transformerName = options.clientType + '.' + options.transformer + '.transformer';
    var transformer = pancakes.cook('transformers/' + transformerName, null);

    // do the transformation
    Q.when(transformer.transform(originalModule, options))
        .then(function (transformedModule) {

            // as long as there is a transformed module, add it to the output buffer
            if (transformedModule) {
                var arr = _.isArray(transformedModule) ? transformedModule : [transformedModule];
                var contents = arr.reduce(function (val, modContents) { return val + modContents; }, '');
                file.contents = new Buffer(contents);
                gulpContext.push(file);
            }

            return next();
        })
        .catch(function (err) {
            gulpContext.emit('error', new gutil.PluginError('gulp-pancakes', err));
            return next();
        });
};

/**
 * This is the main gulp export function
 * @param options
 * @returns {*}
 */
var gulpPancakes = function (options) {
    options = options || {};

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, next) {

        // if file is null or not a JS file, return WITHOUT pushing file
        if (file.isNull() || file.path.substring(file.path.length - 3) !== '.js') {
            gutil.log('File empty or not a JavaScript file: ' + file.path);
            return next();
        }
        // we are not dealing with streams right now, so error
        else if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-pancakes', 'Streams are not supported!'));
            return next();
        }
        // if a buffer, transform
        else if (file.isBuffer()) {
            transformModule(this, file, options, next);
        }
    });
};

/**
 * Static init method used in gulp file to initialize pancakes
 * @param options
 */
gulpPancakes.init = function (options) {
    pancakes = options.require('pancakes');
    pancakes.init(options);
    initOptions = options;
};

// gulp will call this module as a function passing in the gulp options
module.exports = gulpPancakes;



