/**
 * This Gulp plugin will convert node modules that are built with the
 * Pancakes.js standards into client side modules
 */
var _           = require('lodash');
var through     = require('through2');
var pancakes    = require('pancakes');
var	gutil       = require('gulp-util');
var needInit    = true;

module.exports = function (options) {
    options = options || {};

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, next) {
        var me = this;

        // if file is null or not a JS file, return WITHOUT pushing file
        if (file.isNull() || file.path.substring(file.path.length - 3) !== '.js') {
            gutil.log('File empty or not a JavaScript file: ' + file.path);
            return next();
        }
        else if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-pancakes', 'Streams are not supported!'));
            return next();
        }
        else if (file.isBuffer()) {

            if (needInit && options.init) {
                pancakes.init(options.init);
                needInit = false;
            }

            pancakes.transformModule(file.path, options)
                .then(function (transformedModule) {
                    if (transformedModule) {
                        var arr = _.isArray(transformedModule) ? transformedModule : [transformedModule];
                        var contents = arr.reduce(function (val, modContents) { return val + modContents; }, '');
                        file.contents = new Buffer(contents);
                        me.push(file);
                    }

                    return next();
                })
                .catch(function (err) {
                    me.emit('error', new gutil.PluginError('gulp-pancakes', err));
                    return next();
                });
        }
    });
};



