var gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-ruby-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	minifycss 		= require( 'gulp-minify-css' ),
	jshint 			= require( 'gulp-jshint' ),
	uglify 			= require( 'gulp-uglify' ),
	rename 			= require( 'gulp-rename' ),
	concat 			= require( 'gulp-concat' ),
	umd				= require( 'gulp-umd' );


var outputDir 		= 'dist';



//	Default task 'gulp': Runs both CSS and JS tasks
gulp.task( 'default', function() {
    gulp.start( 'css', 'js' );
});



//	Watch task 'gulp watch': Starts a watch on CSS and JS tasks
gulp.task( 'watch', function() {
  gulp.watch( 'src/**/*.scss'	, [ 'css' ] );
  gulp.watch( 'src/**/*.js'		, [ 'js' ] );
});



//	CSS task 'gulp css': Compiles all CSS
gulp.task( 'css', [ 'css-concat-all' ] );

//	1) compile all SCSS to CSS
gulp.task( 'css-compile', function() {
	return sass( 'src/**/*.scss', { style: 'expanded' })
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( minifycss({ keepBreaks: true }) )
		.pipe( gulp.dest( outputDir ) );
});

//	2) concatenate core + offCanvas in dist dir
gulp.task( 'css-concat-core', [ 'css-compile' ], function() {
	return gulp.src([
			outputDir + '/css/jquery.mmenu.oncanvas.css',
			outputDir + '/addons/offcanvas/jquery.mmenu.offcanvas.css',
		])
		.pipe( concat( 'jquery.mmenu.css' ) )
		.pipe( gulp.dest( outputDir + '/css' ) );
});

//	3) concatenate core + offCanvas + addons in dist dir
gulp.task( 'css-concat-all', [ 'css-concat-core' ], function() {
	return gulp.src([
			outputDir + '/css/jquery.mmenu.oncanvas.css',
			outputDir + '/addons/offcanvas/jquery.mmenu.offcanvas.css',
			outputDir + '/addons/**/*.css',
			outputDir + '/extensions/**/*.css',
			'!**/jquery.mmenu.iconbar.css',
			'!**/jquery.mmenu.widescreen.css'
		])
		.pipe( concat( 'jquery.mmenu.all.css' ) )
		.pipe( gulp.dest( outputDir + '/css' ) );
});



//	JS task 'gulp js': Runs all JS tasks
//		A bit extensive, but it needs to concatenate certain files in a certain order
//		The dependencies ensure everything is done in the right order
gulp.task( 'js', [ 'js-umd' ] );

//	1) copy all except for the navbars add-on into dist dir
gulp.task( 'js-copy', function() {
	return gulp.src([
			'src/*/**/*.js',
			'!src/addons/navbars/**/*.js'
		])
		.pipe( rename({ suffix: '.min' }) )
		.pipe( gulp.dest( outputDir ) );
});

//	2) concatenate navbars add-on into dist dir
gulp.task( 'js-concat-navbar', [ 'js-copy' ], function() {
	return gulp.src([
			'src/addons/navbars/jquery.mmenu.navbars.js',
			'src/addons/navbars/**/*.js'
		])
		.pipe( concat( 'jquery.mmenu.navbars.min.js' ) )
		.pipe( gulp.dest( outputDir + '/addons/navbars' ) );
});

//	3) concatenate core + offCanvas + scrollBugFix in dist dir
gulp.task( 'js-concat-core', [ 'js-concat-navbar' ], function() {
	return gulp.src([
			outputDir + '/js/jquery.mmenu.oncanvas.min.js',
			outputDir + '/addons/offcanvas/jquery.mmenu.offcanvas.min.js',
			outputDir + '/addons/scrollbugfix/jquery.mmenu.scrollbugfix.min.js',
		])
		.pipe( concat( 'jquery.mmenu.min.js' ) )
		.pipe( gulp.dest( outputDir + '/js' ) );
});

//	4) concatenate core + offCanvas + scrollBugFix + addons in dist dir
gulp.task( 'js-concat-all', [ 'js-concat-core' ], function() {
	return gulp.src([
			outputDir + '/js/jquery.mmenu.oncanvas.min.js',
			outputDir + '/addons/offcanvas/jquery.mmenu.offcanvas.min.js',
			outputDir + '/addons/scrollbugfix/jquery.mmenu.scrollbugfix.min.js',
			outputDir + '/addons/**/*.js'
		])
		.pipe( concat( 'jquery.mmenu.all.min.js' ) )
		.pipe( gulp.dest( outputDir + '/js' ) );
});

//	5) minify all in dist dir
gulp.task( 'js-minify', [ 'js-concat-all' ], function() {
	return gulp.src([
			outputDir + '/**/*.min.js'
		])
		.pipe( jshint('.jshintrc') )
		.pipe( jshint.reporter( 'default' ) )
		.pipe( uglify({ preserveComments: 'license' }) )
		.pipe( gulp.dest( outputDir ) );
});

//	6) umd core + offCanvas + scrollBugFix + addons in dist dir
gulp.task( 'js-umd', [ 'js-minify' ], function() {
	return gulp.src([
			outputDir + '/js/jquery.mmenu.min.js',
			outputDir + '/js/jquery.mmenu.all.min.js',
		])
		.pipe( umd({
			dependencies: function() { return [ 'jQuery' ]; },
			exports: function() { return true; },
			namespace: sanitizeNamespaceForUmd
		}))
		.pipe( rename({ suffix: '.umd' }) )
		.pipe( gulp.dest( outputDir + '/js' ) );
});
function sanitizeNamespaceForUmd( file ) {
	path = file.path.split( '\\' ).join( '/' ).split( '/' );
	path = path[ path.length - 1 ];
	return path.split( '.' ).join( '_' );
}

