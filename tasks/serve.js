import browserSync from 'browser-sync';
import gulp from 'gulp';

const bs = browserSync.create('server');

gulp.task('serve', () => {
  bs.init({
    files: [
      './public/**/*'
    ],
    notify: false,
    open: true,
    port: 8080,
    reloadOnRestart: true,
    server: {
      baseDir: [
        './public'
      ]
    }
  });
});
