const {
    src,
    dest,
    series,
    parallel,
    watch } = require('gulp');

//compile css
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');


//complie js
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

//compile  image
const imagemin = require('gulp-imagemin');




//utils
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const newer = require('gulp-newer');

//browerSync
const browserSync = require('browser-sync').create();



//path file
const paths ={
    styles : {
        src : './src/scss/main.scss',
        dest : './dist/css/'
    },
    js : {
        src : './src/js/**/*.js',
        dest : './dist/js/'
    },
    image : {
        src : './src/images/**/*',
        dest : './dist/images/'
    }
};

const jsLib = [
    './node_modules/babel-polyfill/dist/polyfill.min.js',
    './node_modules/jquery/dist/jquery.min.js'
];

// browser-sync task
function browser_sync(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 4000
    });
    done();
}
//browser reload

function reload (done) {
    browserSync.reload();
    done();
}


//create task


function styleTask (done) {
    src(paths.styles.src)
    .pipe( sourcemaps.init() )
    .pipe( sass({ errLogToConsole: true }) )
    .on('error', sass.logError)
    .pipe( postcss([autoprefixer(), cssnano()]) )
    .pipe( rename({ suffix : '.min' }) )
    .pipe( sourcemaps.write('./') )
    .pipe( dest(paths.styles.dest) )
    .pipe( browserSync.stream() );

    done();
}


function cssSource (done) {
    src(paths.styles.src)
    .pipe( sass({ errLogToConsole: true }) )
    .on('error', sass.logError)
    .pipe( postcss([autoprefixer()]) )
    .pipe( dest(paths.styles.dest) )
    .pipe( browserSync.stream() );

    done();
}

function jsTask (done) {
    src(paths.js.src)
    .pipe( plumber() )
    .pipe( concat('main.min.js') )
    .pipe( babel({
        presets: ['@babel/env']
    }) )
    .pipe( uglify() )
    .pipe( dest(paths.js.dest) )
    .pipe( browserSync.stream() );

    done();
}

function jsUtil (done) {
    src(jsLib)
    .pipe( plumber() )
    .pipe( dest(paths.js.dest) );

    done();
}

function imageTask (done) {
    src(paths.image.src)
    .pipe(newer(paths.image.dest))
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                { optimizationLevel: 3 },
                { progessive: true },
                { interlaced: true },
                { removeViewBox: false },
                { removeUselessStrokeAndFill: false },
                { cleanupIDs: false }
            ]
        })
    ]))
    .pipe( dest(paths.image.dest) )
    .pipe( browserSync.stream() );

    done();
}


//create watch task src

function watchTasks (done) {
    watch('src/images/**/*',series(imageTask, reload));
    watch('src/scss/**/*.scss', series(styleTask, reload));
    watch('src/scss/**/*.scss',series(cssSource, reload));
    watch(['src/js/**/*.js','src/js/*.js'],series(jsTask, reload) );
    watch('*.html',  reload);
    done();
}


//exports total module tasks


exports.styleTask = styleTask;

exports.jsUtil = jsUtil;

exports.cssSource = cssSource;

exports.jsTask = jsTask;

exports.imageTask = imageTask;

exports.watchTasks = watchTasks;

exports.browser_sync = browser_sync;

exports.watch_files = parallel(watchTasks, browser_sync);

exports.default = series(
    imageTask,
    parallel(
        series(cssSource,styleTask),
        jsTask
    )
);