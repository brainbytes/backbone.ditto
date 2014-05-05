gulp = require 'gulp'
coffee = require 'gulp-iced'
cached = require 'gulp-cached'

gulp.task 'scripts', ->
  gulp.src './src/*'
    .pipe cached()
    .pipe coffee bare: true
    .pipe gulp.dest './lib'

gulp.task 'watch', ->
  gulp.watch './src/*', ['scripts']

gulp.task 'default', ['scripts', 'watch']
