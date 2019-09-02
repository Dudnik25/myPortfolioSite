const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const sass = require('gulp-sass');

const destpath = {
    local: 'app/',
    web: 'C:/xampp/htdocs/dev/dudnikdev/'
};

const jslibspath = [
    'dev/js/libs/*.js'
];

const jspath = [
    'dev/js/*.js'
];

const csslibspath = [
    'dev/css/libs/**/*.css'
];

const csspath = [
    'dev/css/*.css'
];

const scsspath = [
    'dev/css/**/*.scss'
];

gulp.task('scss', function () {
    return gulp.src(scsspath)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('main.min.css'))
        //.pipe(autoprefixer({
        //    browsers: ['last 2 versions'],
        //    cascade: false
        //}))
        //.pipe(cleanCSS())
        .pipe(gulp.dest(destpath.web + 'css'));
});

gulp.task('buildScss', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(destpath.local + 'css'))
        .pipe(gulp.dest(destpath.web + 'css'));
});

gulp.task('buildCss', function () {
    return gulp.src(csspath)
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(destpath.local + 'css'))
        .pipe(gulp.dest(destpath.web + 'css'));
});

gulp.task('buildCssLibs', function () {
    return gulp.src(csslibspath)
        .pipe(concat('libs.min.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(destpath.local + 'css/libs'))
        .pipe(gulp.dest(destpath.web + 'css/libs'));
});

gulp.task('buildPhp', function () {
    return gulp.src('dev/*.php')
        .pipe(gulp.dest(destpath.local))
        .pipe(gulp.dest(destpath.web));
});

gulp.task('buildHtml', function () {
    return gulp.src('dev/*.html')
        .pipe(gulp.dest(destpath.local))
        .pipe(gulp.dest(destpath.web));
});

gulp.task('buildJs', function () {
    return gulp.src(jspath)
        .pipe(concat('main.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(destpath.local + 'js'))
        .pipe(gulp.dest(destpath.web + 'js'));
});

gulp.task('buildJsLibs', function () {
    return gulp.src(jslibspath)
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destpath.local + 'js/libs'))
        .pipe(gulp.dest(destpath.web + 'js/libs'));
});

gulp.task('buildImage', function () {
    return gulp.src('dev/image/*.*')
        .pipe(gulp.dest(destpath.local + 'image'))
        .pipe(gulp.dest(destpath.web + 'image'));
});

gulp.task('buildFonts', function () {
    return gulp.src('dev/fonts/*.*')
        .pipe(gulp.dest(destpath.local + 'fonts'))
        .pipe(gulp.dest(destpath.web + 'fonts'));
});

gulp.task('css', function () {
    return gulp.src(csspath)
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(destpath.web + 'css'))
        .pipe(browserSync.stream());
});

gulp.task('php', function () {
    return gulp.src('dev/*.php')
        .pipe(gulp.dest(destpath.web));
});

gulp.task('html', function () {
    return gulp.src('dev/*.html')
        .pipe(gulp.dest(destpath.web));
});

gulp.task('js', function () {
    return gulp.src(jspath)
        .pipe(concat('main.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        //.pipe(uglify())
        .pipe(gulp.dest(destpath.web + 'js'));
});
gulp.task('watch', function () {
    browserSync.init({
        proxy: "http://localhost/dudnikdev/",
        open: false
    });
    gulp.watch('dev/css/**/*.css', gulp.parallel('css')).on('change', browserSync.reload);
    gulp.watch('dev/js/**/*.js', gulp.parallel('js')).on('change', browserSync.reload);
    gulp.watch('dev/**/*.php', gulp.parallel('php')).on('change', browserSync.reload);
    gulp.watch('dev/**/*.html', gulp.parallel('html')).on('change', browserSync.reload);
    gulp.watch('dev/**/*.scss', gulp.parallel('scss')).on('change', browserSync.reload);
});

gulp.task('build', gulp.series('buildHtml', 'buildScss', 'buildPhp', 'buildJs', 'buildJsLibs', 'buildCss', 'buildCssLibs'));

exports.default = gulp.parallel('scss', 'css', 'html', 'php', 'js', 'watch');