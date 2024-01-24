const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
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