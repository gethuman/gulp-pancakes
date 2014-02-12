/**
 * This Gulp plugin will convert node modules that are built with the
 * Pancakes.js standards into client side modules
 */
var through     = require('through2');
var pancakes    = require('pancakes');
var	gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-pancakes';

module.exports = function (options) {
    options = options || {};

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, callback) {
        var flapjack, moduleInfo;

        if (file.isNull()) {
            //this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback();
        }

        if (file.isBuffer()) {
            flapjack = require(file.path);
            moduleInfo = pancakes.getAnnotation('module', flapjack) || {};

            if (moduleInfo.client) {
                options.moduleName = pancakes.getModuleName(file.path);
                file.contents = new Buffer(pancakes.convertModule(flapjack, options));
                this.push(file);
            }

            // tell the stream engine that we are done with this file
            return callback();
        }

        return callback();
    });
};
