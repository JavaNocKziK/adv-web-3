const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('tsc'));
});

gulp.task('watch', ['scripts'], () => {
    gulp.watch('**/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);