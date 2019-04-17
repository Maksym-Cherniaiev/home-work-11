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
      cache = require("gulp-cache"),
      pngquant = require("imagemin-pngquant"),
      sourcemaps = require("gulp-sourcemaps"),
      imageminJpegRecompress = require("imagemin-jpeg-recompress"),
      prefixer = require("gulp-autoprefixer");

function minCss() {
  return gulp.src("src/css/*.css", {sourcemaps: true})
    .on("error", function (err) {
        console.error("Error!", err.message);
    })
    .pipe(concatCss("bundle.css"))
    .pipe(prefixer("last 4 versions", "> 1%", "ie 9"))
    .pipe(minifyCss())
    .pipe(rename("bundle.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(sourcemaps.write("./", {
      includeContent: false,
      sourceRoot: "/src/css"
    }))
    .pipe(browserSync.stream({match: "**/*.css"}))
}

function transpile() {
  return gulp.src(["src/js/*.js"])
    .pipe(babel({
      plugins: ["@babel/transform-runtime"]
    }))
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src("src/images/*")
  .pipe(cache(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imageminJpegRecompress({
      loops: 5,
      min: 65,
      max: 70,
      quality: "medium"
    }),
    imagemin.svgo(),
    imagemin.optipng({optimizationLevel: 3}),
    pngquant({quality: "65-70", speed: 5})
  ],{
    verbose: true
  })))
  .pipe(gulp.dest("dist/images"))
  .pipe(notify("Image compressed"))
}

function watch() {
  browserSync.init({
    server: {
      baseDir: ["./"]
    }
  });
  gulp.watch("./src/js/**/*.js", gulp.series(transpile));
  gulp.watch("./src/css/**/*.css", gulp.series(minCss));
  gulp.watch("*.html").on("change", browserSync.reload);
}

const build = gulp.series(gulp.parallel(minCss, images, transpile));

exports.default = build;
exports.watch = watch;