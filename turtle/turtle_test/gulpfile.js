const gulp = require('gulp');

gulp.task('minify-css',() => {
	const cleanCSS = require('gulp-clean-css');
  return gulp.src('./css/style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist'));
});
gulp.task('build-js', () => {
	const uglify = require('gulp-uglifyes');
	return gulp.src('./modules/script.js')
		.pipe(uglify({mangle: false,ecma: 6}))
		.pipe(gulp.dest('./dist'));
});
gulp.task('build-index', () => {
	const replace = require('gulp-string-replace');
	const minHTML = require('gulp-htmlmin');
	const rename = require('gulp-rename');
	return gulp.src('./index-dev.html')
		.pipe(replace('"css', '"dist'))
		.pipe(minHTML({'collapseWhitespace': true}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('.'));
});
gulp.task('zip', () => {
	const zip = require('gulp-zip');
	const examples = require('./json/scriptExamples.json');
	// Based on an answer at:
	// https://stackoverflow.com/questions/22685174/how-to-zip-up-zip-files-using-gulp-zip
	// we finally merge them (the zips), zip them again, and output.
	return gulp.src(examples.map(e => `./logo-scripts/${e.filename}`), {base:"./logo-scripts"})
		.pipe(zip('scriptExamples.zip'))
		.pipe(gulp.dest('./dist'));
});