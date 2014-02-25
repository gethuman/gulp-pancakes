/**
 * This Gulp plugin will convert node modules that are built with the
 * Pancakes.js standards into client side modules
 */
var through     = require('through2');
var pancakes    = require('pancakes');
var	gutil       = require('gulp-util');

module.exports = function (options) {
    options = options || {};  //TODO: add options for configuring code gen

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, callback) {

        // if file is null or not a JS file, return WITHOUT pusing file
        if (file.isNull() || file.path.substring(file.path.length - 3) !== '.js') {
            gutil.log('File empty or not a JavaScript file: ' + file.path);
        }

        //TODO: implement for streams, but error for now
        else if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-pancakes', 'Streams are not supported!'));
        }

        // if its a buffer, we can deal with it
        else if (file.isBuffer()) {
            var clientModule = pancakes.generateClient(file.path, options);
            if (clientModule) {
                file.contents = new Buffer(clientModule);
                this.push(file);
            }
        }

        return callback();
    });
};



