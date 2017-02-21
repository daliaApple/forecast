var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('src/css'))
});

gulp.task('build', ['sass'], function (){
  console.log('Building files');
});

gulp.task('default', ['build'], function () {
});
