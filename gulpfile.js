const gulp = require("gulp"),
      concatCss = require("gulp-concat-css"),
      rename = require("gulp-rename"),
      imagemin  = require("gulp-imagemin"),
      notify = require("gulp-notify"),
      minifyCss = require("gulp-minify-css"),
      browserSync = require("browser-sync").create(),
      babel = require("gulp-babel"),
      uglify = require("gulp-uglify-es").default,
      concat = require("gulp-concat"),
      cache = require('gulp-cache'),
      pngquant = require('imagemin-pngquant'),
      imageminJpegRecompress = require('imagemin-jpeg-recompress'),
      prefixer = require("gulp-autoprefixer");

function minCss() {
  return gulp.src("src/css/*.css")
    .pipe(concatCss("bundle.css"))
    .pipe(prefixer("last 4 versions", "> 1%", "ie 9"))
    .pipe(minifyCss())
    .pipe(rename("bundle.min.css"))
    .pipe(gulp.dest("src/dist/css"))
    .pipe(browserSync.stream());
}

function transpile() {
  return gulp.src(["src/js/*.js"])
    .pipe(babel({
      plugins: ['@babel/transform-runtime']
    }))
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("src/dist/js"))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src("src/dist/images/*")
  .pipe(cache(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imageminJpegRecompress({
      loops: 5,
      min: 65,
      max: 70,
      quality:'medium'
    }),
    imagemin.svgo(),
    imagemin.optipng({optimizationLevel: 3}),
    pngquant({quality: '65-70', speed: 5})
  ],{
    verbose: true
  })))
  .pipe(gulp.dest("src/dist/images"))
  .pipe(notify("Image compressed"))
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "src"
    }
  });
  gulp.watch("src/**/*.{html,js,css}").on('change', browserSync.reload);
}

const build = gulp.series(gulp.parallel(minCss, images, transpile));

exports.default = build;
exports.watch = watch;