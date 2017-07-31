const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    fs = require('fs'),
    browserify = require('browserify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    inject = require('gulp-inject-string'),
    deploy = require('gulp-gh-pages');

const gitRepoURLPath = '/bsa-2017-js-calendar/';

/**
 * CSS Autoprefixer, concat all styles to src/css/app.min.css
 */
gulp.task('css', ['remove-min-css'], function() {
    return gulp.src('src/css/**/*.css')
        .pipe(
            autoprefixer([
                'last 15 versions',
                '> 1%',
            ],
            { cascade: true })
        )
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * ES6 JS Babel Transform and save into src/js/app.min.js
 */
gulp.task('scripts', function() {
    return browserify('src/js/app.js')
        .transform('babelify', {presets: ['es2015']})
        .bundle()
        .pipe(fs.createWriteStream('src/js/app.min.js'));
});

/**
 * Compress images
 */
gulp.task('img', function() {
    return gulp.src('src/images/**/*')
        .pipe(
            cache(
                imagemin({
                    interlaced: true,
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [pngquant()],
                })
            )
        )
        .pipe(gulp.dest('dist/images'));
});

/**
 * BrowserSync
 */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src',
        },
        notify: false,
    });
});

/**
 * Clear cache
 */
gulp.task('clear-cache', function() {
    return cache.clearAll();
});

/**
 * Remove the old src/css/app.min.css before the new CSS concatenation
 */
gulp.task('remove-min-css', function() {
    return del.sync('src/css/app.min.css');
});

/**
 * Remove the old dist/ before the new build
 */
gulp.task('remove-dist', function() {
    return del.sync('dist');
});

/**
 * Gulp Watch for the browser auto update
 */
gulp.task('watch', ['browser-sync', 'css', 'scripts'], function() {
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/**/*.html', browserSync.reload);
    gulp.watch('src/repository/**/*', browserSync.reload);
});

/**
 * Gulp Build the new project for production
 */
gulp.task('build', ['remove-dist', 'img', 'css', 'scripts'], function() {

    gulp.src('src/css/app.min.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));

    gulp.src('src/js/app.min.js')
        .pipe(inject.replace('/repository/', gitRepoURLPath + 'repository/'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    gulp.src('src/repository/**')
        .pipe(gulp.dest('dist/repository'));

    gulp.src('src/**/*.html')
        .pipe(inject.replace('src="/', 'src="' + gitRepoURLPath))
        .pipe(inject.replace('href="/', 'href="' + gitRepoURLPath))
        .pipe(gulp.dest('dist'));
});

/**
 * Push the build to gh-pages branch on GitHub
 */
gulp.task('deploy', function () {

    return gulp.src('dist/**/*')
        .pipe(deploy());
});
