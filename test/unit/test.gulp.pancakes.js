/**
 * Unit tests for Pancakes Gulp plugin
 */

/*
var fs = require('fs');
var es = require('event-stream');
var gutil = require('gulp-util');
var gulpPancakes = require('../../lib/gulp.pancakes.js');
var chai = require('chai');
var should = chai.should();


//TODO: need to completely refactor this test from scratch



describe('Unit tests for gulp.pancakes', function () {

	var expectedFile = new gutil.File({
		path: 'test/expected/client-module.js',
		cwd: 'test/',
		base: 'test/expected',
		contents: fs.readFileSync('test/expected/client-module.js')
	});

    var srcFile = new gutil.File({
        path: __dirname + '/../fixtures/flapjack.js',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/flapjack.js')
    });

    before(function () {
        gulpPancakes.init({
            rootDir: __dirname + '/../..',
            require: require
        })
    });

	it('should produce angular factory via buffer', function (done) {
        var doneInvoked = false;
        var stream = gulpPancakes({
            appName: 'testCommonApp',
            output: 'angular',
            type: 'factory'
        });

		stream.on('error', function (err) {
			should.exist(err);
            doneInvoked = true;
			done(err);
		});

		stream.on('data', function (newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);

            var expected = String(expectedFile.contents).replace(/ /g, '');
            var actual = String(newFile.contents).replace(/ /g, '');
            actual.should.equal(expected);
            doneInvoked = true;
			done();
		});

        stream.on('end', function () {
            if (!doneInvoked) {
                done('ERROR: Got to end without a file');
            }
        });

		stream.write(srcFile);
		stream.end();
	});
});
*/
