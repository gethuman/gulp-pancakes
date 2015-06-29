/**
 * This Gulp plugin will convert node modules that are built with the
 * Pancakes.js standards into client side modules
 */
var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var jyt         = require('jyt');
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
function transformModule(gulpContext, file, options, next) {

    if (file.path === 'blank.js') {
        file.contents = new Buffer(' ');
        gulpContext.push(file);
        return next();
    }
    else if (file.path.substring(file.path.length - 3) !== '.js') {
        gutil.log('File not javascript: ' + file.path);
        return next();
    }

    // options are really the init options overrided by these specific transform options
    options.filePath = file.path;
    options.moduleName = pancakes.utils.getCamelCase(file.path);

    // get the original module and the appropriate transformer
    var originalModule = pancakes.requireModule(file.path, true);

    //var transformerName = options.clientType + '.' + options.transformer + '.transformer';
    //var transformer = pancakes.cook('transformers/' + transformerName, null);
    //var transformedModule = transformer.transform(originalModule, options);

	// transform the module
    var transformedModule = pancakes.transform(originalModule, initOptions.pluginOptions, options);

    // as long as there is a transformed module, add it to the output buffer
    if (transformedModule) {
        var arr = _.isArray(transformedModule) ? transformedModule : [transformedModule];
        var contents = arr.reduce(function (val, modContents) { return val + modContents; }, '');
        file.contents = new Buffer(contents);
        gulpContext.push(file);
    }

    return next();
}

/**
 *
 * @param gulpContext
 * @param file
 * @param options
 * @param next
 */
function precompileTemplate(gulpContext, file, options, next) {
    jyt.parse(file.contents, function (err, elem) {

        if (err) {
            gutil.log('Error attempting to precompile ' + file.path + ': ' + err);
            return next();
        }

        file.path = file.path.replace(/\.html$/, '.js');
        file.contents = new Buffer('module.exports = ' + JSON.stringify(elem));
        gutil.log('Precompiled template: ' + file.path);

        gulpContext.push(file);
        return next();
    });
}

/**
 * This is the main gulp export function
 * @param options
 * @returns {*}
 */
function gulpPancakes(options) {
    options = options || {};

    var isPrecompile = !!options.tpls;

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, next) {

        // if file empty return without pushing
        if (file.isNull()) {
            gutil.log('File empty: ' + file.path);
            return next();
        }
        // we are not dealing with streams right now, so error
        else if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-pancakes', 'Streams are not supported!'));
            return next();
        }
        // if a buffer, then process (either precompile or transform)
        else if (file.isBuffer()) {
            var processor = isPrecompile ? precompileTemplate : transformModule;
            return processor(this, file, options, next);
        }
        else {
            gutil.log('Unknown type of file. Cannot process.');
            return next();
        }
    });
}

/**
 * Static init method used in gulp file to initialize pancakes
 * @param options
 */
gulpPancakes.init = function init(options) {
    initOptions = options;
    pancakes = options.require('pancakes');
    gulpPancakes.cook = pancakes.cook;
    gulpPancakes.getService = pancakes.getService;
    gulpPancakes.clearCache = pancakes.clearCache;
    return pancakes.init(options);
};

/**
 * Get client modules from any plugins
 * @param relativePath
 */
gulpPancakes.getPluginModules = function getPluginModules(relativePath) {
    var filesForGulp = [];

    _.each(initOptions.modulePlugins, function (modulePlugin) {
        var fullPath = path.normalize(modulePlugin.rootDir + '/' + relativePath);

        // loop through all the files in the target folder for the plugin
        _.each(fs.readdirSync(fullPath), function (pluginFile) {
            var pluginFilePath = path.normalize(fullPath + '/' + pluginFile);
            filesForGulp.push(pluginFilePath);
        });
    });

    return filesForGulp;
};

// gulp will call this module as a function passing in the gulp options
module.exports = gulpPancakes;
