import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';

gulp.task('scripts', () => {
  return gulp.src('src/scripts/main.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(rename({ basename: 'build' }))
    .pipe(gulp.dest('public/assets/scripts'));
});
