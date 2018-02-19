// Required from NPM
const gulp = require('gulp');
const ts = require('gulp-typescript');
// Ts is an instance of gulp-typcescript
const tsProject = ts.createProject('tsconfig.json');


gulp.task('scripts', () => {
    // Elliot find out where .src() is
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('tsc'));
});

gulp.task('watch', ['scripts'], () => {
    gulp.watch('**/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);