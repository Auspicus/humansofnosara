var gulp = require('gulp');
var sassGlob = require('gulp-sass-glob');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var exec = require('child_process').exec;
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('watch', ['hugo'], function () {
  gulp.watch([
    '../../content/**/*.md',
    '../../config.json',
    './layouts/**/*.html',
    './i18n/*.json',
    './components/**/*.scss',
    './components/**/*.js',
    './static/**/*',
    './scss/**/*.scss'
  ], ['hugo']);
});

gulp.task('hugo', function (done) {
  new Promise(function (resolve, reject) {
    gulp
    .src('./scss/styles.scss')
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 3 versions']))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./static/css'))
    .on('end', resolve);
  })
  .then(function () {
    return new Promise(function (resolve, reject) {
      var bundledStream = through();
      bundledStream
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./static/js/'));

      globby(['./components/**/*.js'])
      .then(function(entries) {
        var b = browserify({
          entries: entries,
          debug: true
        });
        b.bundle().pipe(bundledStream);
      }).catch(function(err) {
        bundledStream.emit('error', err);
      });
  
      resolve(bundledStream);
    });
  })
  .then(function () {
    exec('hugo --source "../../"', function (err, stdout, stderr) {
      if (err)
        console.log(stdout);
      else if (stderr)
        console.log(stdout);
      done();
    });
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
});

gulp.task('default', ['watch']);