const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');

sass.compiler = require('node-sass');

const OUTPUT_FOLDER = '../public';


function scss() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))

        .pipe(concat('style.css'))
        .pipe(gulp.dest(`${OUTPUT_FOLDER}/css`))

        .pipe(concat('style.min.css'))
		.pipe(cleanCSS())
        .pipe(gulp.dest(`${OUTPUT_FOLDER}/css`));
}

function js() {
    return gulp.src('assets/javascript/**/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest(`${OUTPUT_FOLDER}/js`))

        .pipe(concat('script.min.js'))
        .pipe(terser())
        .pipe(gulp.dest(`${OUTPUT_FOLDER}/js`));
}

exports.default = gulp.parallel(scss, js);