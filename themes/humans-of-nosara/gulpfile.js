var gulp = require('gulp');
var sassGlob = require('gulp-sass-glob');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

gulp.task('styles', function () {
  gulp
  .src('./scss/styles.scss')
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer(['last 3 versions']))
  .pipe(cleanCSS())
  .pipe(gulp.dest('./static/css'));
});

gulp.task('default', ['styles']);