module.exports = {
  base : {
    src   : 'src',
    dest  : 'public'
  },

  js : {
    src   : 'js',
    dest  : 'js',
    watch : 'src/**/*.js',
    files : [
      'src/js/index.js',
      'src/examples/parallax/js/index.js',
      'src/examples/smoothscroll/js/index.js',
      'src/examples/dragdropgallery/js/index.js',
      'src/examples/sequenceControl/js/index.js',
      'src/examples/videoControl/js/index.js',
      'src/examples/intersectionObserver/js/index.js'
      ]
  },

  copy: {
    src : [
      'src/**/*',
      '!src/**/index.js',
      '!src/**/base',
      '!src/**/include',
      '!src/**/include/**',
      '!src/css/base',
      '!src/js/modules/',
      '!src/js/modules/**',
      '!src/**/*.coffee',
      '!src/**/*.jade',
      '!src/**/*.{sass,scss}'
    ],
    watch : ['src/**/images/**','src/images/**'],
    dest : 'public/'
  },

  css : {
    src : [
      'src/**/*.scss',
      '!src/**/_*.scss'
    ],
    watch : 'src/**/*.{sass,scss}',
    dest  : './',
    sass  : { indentedSyntax: false },  // Enable .sass syntax (.scss still works too)
    autoprefixer: { browsers: ["last 3 versions", "Android > 4.1", "iOS > 7"]},
    extensions: ['scss', 'sass', 'css']
  },

  html : {
    src   : ['src/**/*.html', '!src/**/include/**'],
    watch : ['src/**/*.html', 'src/**/include/*.html'],
    dest  : ''
  },

  images : {
    src     : 'images/**',
    dest    : 'images',
    watch   : 'src/images/**',
    extensions: ['jpg', 'png', 'svg', 'gif']
  }
}
