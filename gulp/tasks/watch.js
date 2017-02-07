var gulp   = require('gulp');
var config = require('../config');
var path   = require('path');


gulp.task('watch',['browserSync'], function() {
  // gulp.watch(config.images.watch,['imagemin']);
  gulp.watch(config.copy.watch,['copy']);
  gulp.watch(config.js.watch,['js']);
  gulp.watch(config.css.watch,['scss']);
  gulp.watch(config.html.watch,['minifyhtml']);
})
