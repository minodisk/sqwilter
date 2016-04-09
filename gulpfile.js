'use strict'

const https = require('https')
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
    .pipe(gulp.dest('./dist'))
})

gulp.task('updates', (cb) => {
  https.get({
    hostname: 'api.github.com',
    path: '/repos/minodisk/sqwilter/releases/latest',
    method: 'GET',
    headers: {
      'User-Agent': 'sqwilter-publisher'
    },
  }, (res) => {
    let data = ''
    res.on('data', (chunk) => data += chunk.toString('utf8'))
    res.on('end', () => {
      const release = JSON.parse(data)
      const crxURL = release.assets[0].browser_download_url
      gulp.src('./templates/updates.xml')
        .pipe(ejs({crxURL}))
        .pipe(gulp.dest('./'))
        .on('end', cb)
    })
  }).on('error', cb)
})

gulp.task('watch', () => {
  gulp.watch('./lib/**/*', ['lib'])
})
