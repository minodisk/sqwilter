'use const'

const gulp = require('gulp')
const ejs = require('gulp-ejs')
const pkg = require('./package.json')

gulp.task('default', ['build'])
gulp.task('develop', ['build', 'watch'])

gulp.task('build', ['lib', 'manifest'])

gulp.task('lib', () => {
  gulp.src('./lib/**/*')
    .pipe(gulp.dest('./dist'))
})

gulp.task('manifest', () => {
  gulp.src('./templates/manifest.json')
    .pipe(ejs({pkg: pkg}))
    .pipe('./dist')
})

gulp.task('watch', () => {
  gulp.watch('./lib/**/*', ['lib'])
})
