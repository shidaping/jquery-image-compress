var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
gulp.task('uglifyJs',function(){
    return gulp.src("src/js/jquery-image-compress.js")
        .pipe(uglify())
        .pipe(rename('jquery-image-compress.min.js'))
        .pipe(gulp.dest("dist/js/"))
})

gulp.task('watch', function () {
    gulp.watch('src/js/**/*.*', ['uglifyJs']);
});

gulp.task('default',['uglifyJs']);
