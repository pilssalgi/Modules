var gulp        = require('gulp');
var config      = require('../config');
var browserSync = require('browser-sync');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var path        = require('path');

var paths = {
  src: path.join(config.base.src, config.images.src),
  dest: path.join(config.base.dest, config.images.dest)
}

gulp.task('imagemin', function() {
  return gulp.src(paths.src)
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.reload({stream:true}))
})
