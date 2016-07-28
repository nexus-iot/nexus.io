var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var watch = require('gulp-watch');

gulp.task('start', function () {
  nodemon({
    script: 'bin/start.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development', 'PORT': 8080 }
  })
});

gulp.task('watch-less', function() {
    gulp.watch('./web/style/*.less', ['less']);  // Watch all the .less files, then run the less task
});

gulp.task('less', function () {
    return gulp.src('./web/style/style.less')
    .pipe(less())
    .pipe(gulp.dest('./web/style/'));
});
