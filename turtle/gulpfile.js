const cleanCSS = require('gulp-clean-css');
const es = require('event-stream');
const gulp = require('gulp');
const examples = require('./json/scriptExamples.json');
const minHTML = require('gulp-htmlmin');
const rename = require('gulp-rename');
const replace = require('gulp-string-replace');

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
gulp.task('zip', () => {
	// Open json/scriptExamples.json.
	// Loop through every example.
	examples.forEach(function(exampleInfo) {
		console.log(exampleInfo.filename);
	});
	// Based on an answer at:
	// https://stackoverflow.com/questions/22685174/how-to-zip-up-zip-files-using-gulp-zip
	// we finally merge them (the zips), zip them again, and output.
	return es.merge.apply(null, zips)
		.pipe(zip('scriptExamples.zip'))
		.pipe(gulp.dest('./dist'));
});