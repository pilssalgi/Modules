let gulp          = require('gulp');
let config        = require('../config');
let path          = require('path');
let uglify        = require('gulp-uglify');
let browserify    = require('browserify');
let source        = require('vinyl-source-stream');
let buffer        = require('vinyl-buffer');
let browserSync   = require('browser-sync');
let handleErrors  = require('../lib/handleErrors');
let babelify      = require('babelify');
let dest          = path.join(config.base.dest, config.js.dest);

gulp.task('js',function(){
  for(var i=0,n = config.js.files.length; i<n; i++){
    var url = config.js.files[i];
    var arr   = url.split('/');
    var name  = arr.pop();
    var dest  = arr.join('/')+'/'
    dest = dest.replace('src','public');
    if(i<n-1){
      browserify(url,{ debug: true })
        .transform(babelify)
        .bundle()
        .pipe(source(name))
        .pipe(buffer())
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(gulp.dest(dest))
    }else{
      browserify(url,{ debug: true })
      .transform(babelify)
      .bundle()
      .pipe(source(name))
      .pipe(buffer())
      .pipe(uglify())
      .on('error', handleErrors)
      .pipe(gulp.dest(dest))
      .pipe(browserSync.stream())
    }
  }
});
