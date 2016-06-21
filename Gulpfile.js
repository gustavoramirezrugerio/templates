// incluir plug-ins de gulp  http://gulpjs.com/plugins/
var gulp        = require('gulp'),
jshint          = require('gulp-jshint'),
uglify          = require('gulp-uglify'),
changed         = require('gulp-changed')
imagemin        = require('gulp-imagemin'),
stripDebug      = require('gulp-strip-debug'),
minifyCSS       = require('gulp-minify-css'),
minifyHTML      = require('gulp-minify-html'),
rename          = require('gulp-rename'),
browserify      = require('gulp-browserify');
var minifyInline = require('gulp-minify-inline');

//::::::::::::::::::::: Creacion de tareas "development"
var scr_origen  = "sitio";
var scr_destino = "production";

gulp.task('jshint', function() {
gulp.src(scr_origen+'/assets/js/*.js')
.pipe(jshint())
.pipe(jshint.reporter('default'));
});

//::::::::::::::::::::: Creacion de tareas "production"
gulp.task('minificarJS', function () {
gulp.src(scr_origen+'/assets/js/**/*.js')
.pipe(browserify())
.pipe(uglify({ compress: true }))
.pipe(stripDebug())
.pipe(gulp.dest(scr_destino+'/assets/js'));
});

gulp.task('minificarVendorJS', function () {
gulp.src(scr_origen+'/assets/vendors/**/*.js')
.pipe(browserify())
.pipe(uglify({ compress: true }))
.pipe(stripDebug())
.pipe(gulp.dest(scr_destino+'/assets/vendors'));
});

gulp.task('css', function () {
gulp.src(scr_origen+'/assets/css/**/*.css')
.pipe(minifyCSS({ keepSpecialComments: '*', keepBreaks: '*'}))
.pipe(gulp.dest(scr_destino+'/assets/css'));
});

gulp.task('minificarVendorCSS', function () {
gulp.src(scr_origen+'/assets/vendors/**/*.css')
.pipe(minifyCSS({ keepSpecialComments: '*', keepBreaks: '*'}))
.pipe(gulp.dest(scr_destino+'/assets/vendors/'));
});

gulp.task('images', function () {
var imgSrc      = scr_origen+'/assets/imagenes/**/*',
imgDst          = scr_destino+'/assets/imagenes';
gulp.src(scr_origen+'/assets/imagenes/**/*')
.pipe(changed(imgDst))
.pipe(imagemin())
.pipe(gulp.dest(imgDst));
});

gulp.task('minificarVendorIMAGENES', function () {
var imgSrc      = scr_origen+'/assets/vendors/**/*',
imgDst          = scr_destino+'/assets/vendors/';

gulp.src(scr_origen+'/assets/vendors/**/*')
.pipe(changed(imgDst))
.pipe(imagemin())
.pipe(gulp.dest(imgDst));
});


gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src(scr_origen+'/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(scr_destino+'/'));
});


gulp.task('fonts', function () { //solamente se copia
gulp.src( scr_origen+'/assets/fonts/*')
.pipe(gulp.dest( scr_destino+'/assets/fonts/'));
});


//Agrupacion de tareas
gulp.task('default', [ 'minificarJS', 'minificarVendorCSS', 'minificarVendorIMAGENES', 'css', 'images', 'minify-html', 'fonts' ]);
//gulp.task('default', [ 'minificarVendorJS' ]);
//
//gulp.task('default', [ 'minify-html'  ]);
//gulp.task('default', [ 'jshint' ]);

