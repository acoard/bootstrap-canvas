var gulp = require("gulp");
var to5 = require("gulp-6to5");
var rename = require('gulp-rename');
var browserify = require("browserify");
var to5ify = require("6to5ify");


gulp.task('watch', function() {
  gulp.watch("src/*.es6", ['default']);
});


    

gulp.task("default", function () {
  return gulp.src("src/*.es6")
  // .pipe(browserify())
    .pipe(to5())
    .pipe(rename(function(path){
        path.extname = '.js'
    }))
    .pipe(gulp.dest("dist/"));
});