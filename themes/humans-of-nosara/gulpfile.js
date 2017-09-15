var gulp = require('gulp');
var sassGlob = require('gulp-sass-glob');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var exec = require('child_process').exec;

gulp.task('watch', ['hugo'], function () {
  gulp.watch([
    '../../content/**/*.md',
    './layouts/**/*.html',
    './i18n/*.json',
    './static/**/*'
  ], ['hugo']);
  gulp.watch([
    './scss/**/*.scss',
    './layouts/**/*.scss'
  ], ['styles']);
});

gulp.task('hugo', ['styles'], function (done) {
  exec('hugo --source "../../"', function (err, stdout, stderr) {
    if (err)
      console.log(stdout);
    else if (stderr)
      console.log(stdout);
    done();
  });
});

gulp.task('styles', function () {
  gulp
  .src('./scss/styles.scss')
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer(['last 3 versions']))
  .pipe(cleanCSS())
  .pipe(gulp.dest('./static/css'));
});

gulp.task('default', ['watch']);