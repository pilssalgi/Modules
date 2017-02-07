var gulp        = require('gulp');
var config      = require('../config');
var path        = require('path');
var uglify      = require('gulp-uglify');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var browserSync = require('browser-sync');
var handleErrors = require('../lib/handleErrors');

var dest = path.join(config.base.dest, config.js.dest);

gulp.task('js',function(){
  browserify('src/js/index.js')
  .bundle().on('error', handleErrors)
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(dest))
  .pipe(browserSync.reload({stream:true}));

});