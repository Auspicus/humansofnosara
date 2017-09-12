var gulp = require('gulp');

var postcss = require('gulp-postcss');
var atImporter = require('postcss-easy-import');
var nesting = require('postcss-nesting');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('styles', function () {
  gulp
  .src('./css/styles.css')
  .pipe(postcss([
    atImporter(),
    nesting(),
    autoprefixer({ browsers: ['last 3 versions'] }),
    cssnano()
  ]))
  .pipe(gulp.dest('./static/css'));
});

gulp.task('default', ['styles']);