const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const minHTML = require('gulp-htmlmin');
const rename = require('gulp-rename');
const replace = require('gulp-string-replace');
const zip = require('gulp-zip');

gulp.task('minify-css',() => {
  return gulp.src('./css/style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist'));
});
gulp.task('build-index', () => {
	return gulp.src('./index-dev.html')
		.pipe(replace('"css', '"dist'))
		.pipe(minHTML({'collapseWhitespace': true}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('.'));
});
gulp.task('indexes', () => {
	const indexFiles = require('./node-tools/indexFiles');
	indexFiles('./logo-scripts/cheerful-netherlands-logo-content', 'lgo');
	indexFiles('./logo-scripts/go-content', 'lgo');
	indexFiles('./logo-scripts/internal/command-procs', 'lgo');
	indexFiles('./logo-scripts/processing-content/js-processing', 'lgo');
	indexFiles('./logo-scripts/basic/micro-a', 'lgo');
	indexFiles('./logo-scripts/basic/qbasic', 'lgo');
	indexFiles('./logo-scripts/l-systems/0L', 'lgo');
	indexFiles('./logo-scripts/terrapin', 'lgo');
	indexFiles('./logo-scripts/texas-instruments-99-a4', 'lgo');
	indexFiles('./tests/data/ada', 'txt');
	indexFiles('./tests/data/asm-turtle', 'trt');
	indexFiles('./tests/data/basic/amos-basic', 'txt');
	indexFiles('./tests/data/basic/applesoft-basic', 'txt');
	indexFiles('./tests/data/basic/ansi-basic', 'txt');
	indexFiles('./tests/data/basic/atari-turbo-basic-xl', 'txt');
	indexFiles('./tests/data/basic/basil', 'txt');
	indexFiles('./tests/data/basic/bbc-basic', 'txt');
	indexFiles('./tests/data/basic/commodore-basic', 'txt');
	indexFiles('./tests/data/basic/micro-a', 'txt');
	indexFiles('./tests/data/basic/misc-8-bit-basic-examples', 'txt');
	indexFiles('./tests/data/basic/playbasic', 'txt');
	indexFiles('./tests/data/basic/qbasic', 'txt');
	indexFiles('./tests/data/basic/qbasic/gwbasic', 'txt');
	indexFiles('./tests/data/basic/qbasic/msxbasic', 'txt');
	indexFiles('./tests/data/basic/qbasic/qb64', 'txt');
	indexFiles('./tests/data/basic/sinclair-basic', 'txt');
	indexFiles('./tests/data/basic/small-visual-basic', 'txt');
	indexFiles('./tests/data/basic/tektronix-405x-basic', 'txt');
	indexFiles('./tests/data/basic/texas-instruments-99-4a', 'txt');
	indexFiles('./tests/data/basic/trs-80-basic', 'txt');
	indexFiles('./tests/data/basic/true-basic', 'txt');
	indexFiles('./tests/data/batch', 'txt');
	indexFiles('./tests/data/css', 'txt');
	indexFiles('./tests/data/holy-c', 'txt');
	indexFiles('./tests/data/hpgl', 'txt');
	indexFiles('./tests/data/javascript-2d-canvas', 'txt');
	indexFiles('./tests/data/javascript-processing', 'txt');
	indexFiles('./tests/data/l-systems/cgjennings', 'txt');
	indexFiles('./tests/data/l-systems/fractint', 'txt');
	indexFiles('./tests/data/l-systems/0L', 'txt');
	indexFiles('./tests/data/logo-scripts/cheerful-netherlands-logo', 'txt');
	indexFiles('./tests/data/logo-scripts/code-heart-turtlescript', 'txt');
	indexFiles('./tests/data/logo-scripts/fms-logo', 'lgo');
	indexFiles('./tests/data/logo-scripts/kturtle', 'txt');
	indexFiles('./tests/data/logo-scripts/logo-3d', 'txt');
	indexFiles('./tests/data/logo-scripts/logo-interpreter', 'txt');
	indexFiles('./tests/data/logo-scripts/papert', 'txt');
	indexFiles('./tests/data/logo-scripts/sonic-webturtle', 'txt');
	indexFiles('./tests/data/logo-scripts/super-logo', 'txt');
	indexFiles('./tests/data/logo-scripts/terrapin', 'txt');
	indexFiles('./tests/data/odin', 'txt');
	indexFiles('./tests/data/osmosian-plain-english', 'txt');
	indexFiles('./tests/data/pitrified-go-turtle', 'txt');
	indexFiles('./tests/data/pitrified-go-turtle/go', 'txt');
	indexFiles('./tests/data/pov-ray', 'txt');
	indexFiles('./tests/data/processing', 'txt');
	indexFiles('./tests/data/rust-turtle', 'txt');
	indexFiles('./tests/data/sugarlabs-turtle-blocks', 'json');
	indexFiles('./tests/data/sugarlabs-turtle-blocks/html', 'html');
	return Promise.resolve();
});
gulp.task('js-filenames', () => {
	const printJSFilenames = require('./node-tools/printJSFilenames');
	return printJSFilenames();
});
gulp.task('zip', () => {
	const examples = require('./json/scriptExamples.json');
	// Based on an answer at:
	// https://stackoverflow.com/questions/22685174/how-to-zip-up-zip-files-using-gulp-zip
	// we finally merge them (the zips), zip them again, and output.
	return gulp.src(examples.map(e => `./logo-scripts/${e.filename}`), {base:"./logo-scripts"})
		.pipe(zip('scriptExamples.zip'))
		.pipe(gulp.dest('./dist'));
});