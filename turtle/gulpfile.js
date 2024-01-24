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
	indexFiles('./tests/data/logo-scripts/kturtle', 'txt');
	indexFiles('./tests/data/logo-scripts/logo-3d', 'txt');
	indexFiles('./tests/data/logo-scripts/code-heart-turtlescript', 'txt');
	indexFiles('./tests/data/logo-scripts/papert', 'txt');
	indexFiles('./tests/data/logo-scripts/sonic-webturtle', 'txt');
	indexFiles('./tests/data/asm-turtle');
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