import gulp from 'gulp';
import requireDir from 'require-dir';
import runSequence from 'run-sequence';

requireDir('tasks', { recurse: true });

gulp.task('default', () => {
	runSequence('build', 'serve', 'watch');
});
