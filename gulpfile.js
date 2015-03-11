'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var browserSync = require('browser-sync');
var to5 = require("gulp-6to5");
var to5ify = require("6to5ify");


gulp.task('clean', function(cb){
    rimraf('./dist', cb);
});

gulp.task('css', function(){
    gulp.src('./src/*.css')
    .pipe(gulp.dest('./dist'));
})

gulp.task('build', ['clean'], function() {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'));
        gulp.start('css');

        browserify({
        entries: './src/app.js',
        debug: true
        })
        .transform(to5ify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist'));

        browserify({
        entries: ['./src/models/Canvas.js', './src/models/UIController.js', './src/models/ImageElementHandler.js'],
        // entries: './src/models/*.js'
        debug: true
        })
        .transform(to5ify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/models'));

        //plain JS
        gulp.src('src/vendor/**')
        .pipe(gulp.dest('./dist/vendor'));
});


gulp.task('watch', function () {
    gulp.watch("src/**/*.js", ['build', browserSync.reload]);
    gulp.watch("src/*.html", ['build', browserSync.reload]);
    gulp.watch('src/*.css', ['css']);
});

gulp.task('serve', ['build', 'watch', 'css'], function () {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('default', ['serve']);