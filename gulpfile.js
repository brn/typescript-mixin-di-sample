/**
 * @fileoverview
 * @author Taketoshi Aono
 */

const fs                 = require('fs');
const gulp               = require('gulp');
const path               = require('path');
const {execSync}         = require('child_process');

const DIST = 'dist';
const BIN_DIR = path.resolve(process.cwd(), './node_modules/.bin/') + '/';
const GITHUB_AUTH = 'YWR0ZWNoLWF0b206NDU4NjgxNmM5Mzc1NGNmNTIzYmRkMWYwM2VmNDI0M2YwYzhhYWYyOQ==';


if (!process.env.JSPM_GITHUB_AUTH_TOKEN) {
  process.env.JSPM_GITHUB_AUTH_TOKEN = GITHUB_AUTH;
}


gulp.task('serve', done => {

  try {
    if (String(process.pid) !== fs.readFileSync('.dev.pid', 'utf8')) {
      throw new Error('Old server process exists.\nKill old process by \'npm run stop-dev\' or \'gulp stop-serve\'');
    }
  } catch(e) {}

  const express = require('express');
  const serveStatic = require('serve-static');
  const https = require('https');
  const serve = serveStatic('./');
  const app = express();

  const certOptions = {
    cert: fs.readFileSync('./certs/server.crt'),
    key: fs.readFileSync('./certs/server.key')
  };

  app.use(serve);
  app.get('/main.js', (req, res) => {
    res.setHeader('content-type', 'application/javascript');
    res.send(fs.readFileSync('app/main.js', 'utf8'));
  });
  https.createServer(certOptions, app).listen(8181);
});


function typescript(paths) {
  const tsc = require('gulp-typescript');
  const sourceMaps = require('gulp-sourcemaps');
  const project = tsc.createProject('tsconfig.json', {
    typescript: require('typescript')
  });
  return gulp.src(paths)
    .pipe(project());
}


/**
 * typescriptのコンパイル
 */
gulp.task('typescript-public-dependency', () => {
  const tsc = require('gulp-typescript');
  return typescript(['samples/public-dependency-pattern/*.ts'])
    .pipe(gulp.dest('lib/public-dependency/'))
    .on('error', () => process.exit(1));
});


gulp.task('typescript-method-injections', () => {
  const tsc = require('gulp-typescript');
  return typescript(['samples/method-injection-pattern/*.ts'])
    .pipe(gulp.dest('lib/method-injection/'))
    .on('error', () => process.exit(1));
});


function minify(path, pref) {
  var browserify = require('gulp-browserify');
  return gulp.src(path)
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(gulp.dest(`${DIST}/${pref}`));
}


/**
 * minify
 */
gulp.task('minify-public-dependency', ['typescript-public-dependency'], () => {
  minify('lib/public-dependency/main.js', 'public-dependency');
});


gulp.task('minify-method-injection', ['typescript-method-injections'], () => {
  minify('lib/method-injection/main.js', 'method-injection');
});


/**
 * 一時ファイルの削除
 */
gulp.task('clean', (cb) => {
  require('del')([DIST, 'lib'], cb);
});


gulp.task('build', ['minify-public-dependency', 'minify-method-injection']);


gulp.task('default', ['build']);
