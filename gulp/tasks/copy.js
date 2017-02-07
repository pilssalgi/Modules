var gulp         = require('gulp');
var config       = require('../config');
var browserSync  = require('browser-sync');

gulp.task('copy', function() {
  return gulp.src(config.copy.src)
    .pipe(gulp.dest(config.copy.dest))
    .pipe(browserSync.reload({stream:true}));
});
