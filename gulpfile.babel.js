import { src, dest, watch, series, parallel } from 'gulp';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
// import replace from 'gulp-replace';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import fibers from 'fibers';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import webpackConfig from './webpack.config.js';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import { eslint } from 'eslint';

const sass = gulpSass(dartSass);

const files = {
  scssPath: 'src/Scss/**/*.scss', // any file with .scss
  jsPath: 'src/Js/**/*.js', // any file with .js
  jsDestPath: 'dist/js/',
  scssDestpath: 'dist/css/',
};

function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass({ fiber: fibers }))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'Error...',
          message: '<%= error.message %>',
        }),
      })
    )
    .pipe(sass({ outputStyle: 'compressed', errLogToConsole: false }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(files.scssDestpath));
}

function jsTask() {
  return src(files.jsPath)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'Error...',
          message: '<%= error.message %>',
        }),
      })
    )
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(webpack(webpackConfig))
    .pipe(dest(files.jsDestPath))
    .pipe(browserSync.stream());
}

function jsEslint() {
  src(files.jsPath)
    .pipe(
      plumber({
        errorHandler: function (error) {
          const taskName = 'eslint';
          const title = '[task]' + taskName + ' ' + error.plugin;
          const errorMsg = 'error: ' + error.message;
          console.error(title + '\n' + errorMsg);
          notify.onError({
            title: title,
            message: errorMsg,
            time: 3000,
          });
        },
      })
    )
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop());
  done();
}

function watchTask() {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html',
    },
  });

  watch('./*.html').on('change', browserSync.reload);
  watch('./dist/*/*.+(js|css)').on('change', browserSync.reload);
  watch('./dist/*/*/*.+(js|css)').on('change', browserSync.reload);

  watch(files.jsPath, jsTask);
  watch(files.jsPath, jsEslint);
  watch(files.scssPath, scssTask);
}

exports.default = series(jsTask, watchTask, scssTask);
