'use strict';

/* Paths to source files (src), ready-made files (build), and those that need to be monitored for changes (watch) */
var path = {
    build: {
        html: 'assets/build/',
        js: 'assets/build/js/',
        php: 'assets/build/php/',
        css: 'assets/build/css/',
        lib: 'assets/build/lib/',
        img: 'assets/build/img/'
        // ,
        // fonts: 'assets/build/fonts/'
    },
    src: {
        html: 'assets/src/*.html',
        js: 'assets/src/js/script.js',
        php: 'assets/src/php/mail.php',
        less: 'assets/src/less/style.less',
        lib: 'assets/src/lib/**/*.*',
        img: 'assets/src/img/**/*.*'
        // ,
        // fonts: 'assets/src/fonts/**/*.*'
    },
    watch: {
        html: 'assets/src/**/*.html',
        js: 'assets/src/js/**/*.js',
        php: 'assets/src/php/**/*.php',
        css: 'assets/src/less/**/*.less',
        lib: 'assets/src/lib/**/*.*',
        img: 'assets/src/img/**/*.*'
        // ,
        // fonts: 'assets/srs/fonts/**/*.*'
    },
    clean: './assets/build/*'
};

/* Server setting */
var config = {
    server: {
        baseDir: './assets/build'
    },
    notify: false
};

/* Connecting gulp and plugins */
var gulp = require('gulp'), // Connecting Gulp
    webserver = require('browser-sync'), // Server for working and automatically updating pages
    plumber = require('gulp-plumber'), // Error tracking module
    rigger = require('gulp-rigger'), // Module for importing the contents of one file to another
    sourcemaps = require('gulp-sourcemaps'), // Module for generating a map of source files
    less = require('gulp-less'), // Module for compiling less in CSS
    autoprefixer = require('gulp-autoprefixer'), // Module for automatic installation of auto-refixes
    cleanCSS = require('gulp-clean-css'), // CSS minimization plugin
    uglify = require('gulp-uglify'), // Module for minimizing JavaScript
    cache = require('gulp-cache'), // Module for caching
    imagemin = require('gulp-imagemin'), // Plugin for compressing PNG, JPEG, GIF and SVG images
    jpegrecompress = require('imagemin-jpeg-recompress'), // JPEG compression plugin 
    pngquant = require('imagemin-pngquant'), // PNG compression plugin
    rimraf = require('gulp-rimraf'), // Plugin for deleting files and directories
    rename = require('gulp-rename');

/* Tasks */

// Server startup
gulp.task('webserver', function () {
    webserver(config);
});

// Collecting html
gulp.task('html:build', function () {
    return gulp.src(path.src.html) // Selecting all html files in the specified path
        .pipe(plumber()) // Error tracking
        .pipe(rigger()) // Importing attachments
        .pipe(gulp.dest(path.build.html)) // Uploading ready-made files
        .pipe(webserver.reload({ stream: true })); // Server restart
});

// The collection of styles
gulp.task('css:build', function () {
    return gulp.src(path.src.less) // Get style.less
        .pipe(plumber()) // For tracking errors
        .pipe(sourcemaps.init()) // Initializing sourcemap
        .pipe(less()) // less -> CSS
        .pipe(autoprefixer()) // Adding prefixes
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) // Minimizing CSS
        .pipe(sourcemaps.write('./')) // Writing sourcemap
        .pipe(gulp.dest(path.build.css)) // Uploading to build
        .pipe(webserver.reload({ stream: true })); // Restart the server
});

// Collecting js
gulp.task('js:build', function () {
    return gulp.src(path.src.js) // Get the file script.js
        .pipe(plumber()) // For tracking errors
        .pipe(rigger()) // Importing all the specified files to script.js
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init()) // Initializing sourcemap
        .pipe(uglify()) // Minimizing js
        .pipe(sourcemaps.write('./')) // Writing sourcemap
        .pipe(gulp.dest(path.build.js)) // Put the finished file
        .pipe(webserver.reload({ stream: true })); // Restart the server
});

// PHP migration
gulp.task('php:build', function () {
    return gulp.src(path.src.php)
        .pipe(gulp.dest(path.build.php));
});

// The transfer of libraries
gulp.task('lib:build', function () {
    return gulp.src(path.src.lib)
        .pipe(gulp.dest(path.build.lib));
});

// Font migration
// gulp.task('fonts:build', function () {
//     return gulp.src(path.src.fonts)
//         .pipe(gulp.dest(path.build.fonts));
// });

// Image processing
gulp.task('img:build', function () {
    return gulp.src(path.src.img) // The path from the source images
        .pipe(cache(imagemin([ // Image compression
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.build.img)); // Unloading of the finished files
});

// Deleting the build folder 
gulp.task('clean:build', function () {
    return gulp.src(path.clean, { read: false })
        .pipe(rimraf());
});

// Clear the cache
gulp.task('cache:clear', function () {
    cache.clearAll();
});

// Assembly
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'lib:build',
            'css:build',
            'js:build',
            'php:build',
            // 'fonts:build',
            'img:build'
        )
    )
);

// Launch tasks when files are changed
gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build')).on('change', function () {
        webserver.reload();
    });
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.js, gulp.series('php:build'));
    gulp.watch(path.watch.img, gulp.series('lib:build'));
    gulp.watch(path.watch.img, gulp.series('img:build'));
    // gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

// The default task
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('webserver','watch')
));