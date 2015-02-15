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

gulp.task('build', ['clean'], function() {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'));



        //first two are es6
        // gulp.src( ["src/app.js"] )
        // .pipe(to5())
        // .pipe(gulp.dest('./dist'));

        browserify({
        entries: './src/app.js',
        debug: true
        })
        .transform(to5ify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist'));
        
        // gulp.src( ["src/models/*.js"] )
        // .pipe(to5())
        // .pipe(gulp.dest('./dist/models/'));
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


// gulp.task("default", function () {
//   return gulp.src(["src/*.es6"])
//   // .pipe(browserify())
    // .pipe(to5())
//     .pipe(rename(function(path){
//         path.extname = '.js'
//     }))
//     .pipe(gulp.dest("dist/"));
// });

gulp.task('watch', function () {
    gulp.watch("src/**/*.js", ['build', browserSync.reload]);
    gulp.watch("src/*.html", ['build', browserSync.reload]);
});

gulp.task('serve', ['build', 'watch'], function () {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('default', ['serve']);


// var gulp = require('gulp');
// var source = require('vinyl-source-stream');
// var browserify = require("browserify");
// var to5ify = require("6to5ify");

// gulp.task('build', function() {
//     return browserify({
//         entries: './assets/scripts/main6.js',
//         debug: true
//         })
//         .transform(to5ify)
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest('./assets/static/'));
// });



// var getBundleName = function () {
//   // var version = require('./package.json').version;
//   var name = require('./package.json').name;
//   return name + 'min';
//   // return version + '.' + name + '.' + 'min';
// };

// // gulp.task('browserifyjs', ['build'], function() {
// gulp.task('browserifyjs', function() {


//   var bundler = browserify({
//     entries: ['./dist/app.js'],
//     debug: true
//   });

//   var bundle = function() {
//     return bundler
//       .bundle()
//       .pipe(source(getBundleName() + '.js'))
//       .pipe(buffer())
//       .pipe(sourcemaps.init({loadMaps: true}))
//         // Add transformation tasks to the pipeline here.
//         // .pipe(uglify())
//       .pipe(sourcemaps.write('./'))
//       .pipe(gulp.dest('./dist/js/'));
//   };

//   // return bundle();
// });