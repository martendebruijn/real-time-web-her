const gulp = require('gulp'),
  { series, parallel } = require('gulp'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  terser = require('gulp-terser');

const jsFiles = ['./server/src/js/*.js'],
  cssFiles = [
    './server/src/css/reset.css',
    './server/src/css/themes/light.css',
    './server/src/css/themes/dark.css',
    './server/src/css/*.css',
    '!./server/src/css/front.css',
  ];
function cssChat() {
  return gulp
    .src(cssFiles)
    .pipe(concat('styles.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest('./server/public/dist/'));
}
function cssFront() {
  return gulp
    .src(
      './server/src/css/front.css',
      './server/src/css/themes/light.css',
      './server/src/css/themes/dark.css'
    )
    .pipe(concat('front.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest('./server/public/dist/'));
}
function es() {
  return gulp
    .src(jsFiles)
    .pipe(terser())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./server/public/dist/'));
}
function watch() {
  gulp.watch(cssFiles, css);
  gulp.watch(jsFiles, es);
}

const css = gulp.series(cssFront, cssChat);
const build = gulp.series(css, es);

exports.css = css;
exports.es = es;
exports.watch = watch;
exports.build = build;
exports.default = build;
