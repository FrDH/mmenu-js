/*
	jQuery.mmenu gulpfile.js

	Default gulp tasks	:
	$ gulp 				: Runs "css" and "js" tasks
	$ gulp watch		: Starts a watch on "css" and "js" tasks

	Custom gulp tasks	:
	$ gulp custom-css 	: Compile and concatenate custom CSS.
	$ gulp custom-build : Concatenate JS and CSS files.
*/


var gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-ruby-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	uglify 			= require( 'gulp-uglify' ),
	rename 			= require( 'gulp-rename' ),
	concat 			= require( 'gulp-concat' ),
	umd				= require( 'gulp-umd' ),
	ms				= require( 'merge-stream' ),
	fs 				= require( 'fs' );


var inputDir 		= 'src',
	outputDir 		= 'dist',
	customDir 		= './../mmenu-custom',
	translations	= [ 'nl', 'de' ];


function sanitizeNamespaceForUmd( file ) {
	path = file.path.split( '\\' ).join( '/' ).split( '/' );
	path = path[ path.length - 1 ];
	return path.split( '.' ).join( '_' );
}





/*
	$ gulp
*/

gulp.task( 'default', [ 'custom-css-reset' ], function() {
	gulp.start( [ 'js', 'css' ] );
});





/*
	$ gulp watch
*/

gulp.task( 'watch', [ 'custom-css-reset' ], function() {
	gulp.watch( inputDir + '/**/*.scss'	, [ 'css' ] );
	gulp.watch( inputDir + '/**/*.js'	, [ 'js'  ] );
});





/*
	$ gulp css
*/

gulp.task( 'css', [ 'css-concat-all' ] );


//	1)	Compile all SCSS to CSS
gulp.task( 'css-compile', function() {

	return sass( inputDir + '/**/*.scss', { style: 'expanded' })
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( gulp.dest( outputDir ) );
});


//	2) 	Concatenate core
//		Can't use glob, needs to be in specific order
gulp.task( 'css-concat-core', [ 'css-compile' ], function() {

	return gulp.src([
			outputDir + '/core/oncanvas/jquery.mmenu.oncanvas.css',
			outputDir + '/core/offcanvas/jquery.mmenu.offcanvas.css',
			outputDir + '/core/screenreader/jquery.mmenu.screenreader.css'
		])
		.pipe( concat( 'jquery.mmenu.css' ) )
		.pipe( gulp.dest( outputDir ) );
});


//	3) 	Concatenate all in dist dir
gulp.task( 'css-concat-all', [ 'css-concat-core' ], function() {

	return gulp.src([
			outputDir + '/jquery.mmenu.css',
			outputDir + '/extensions/**/*.css',
			outputDir + '/addons/**/*.css'
		])
		.pipe( concat( 'jquery.mmenu.all.css' ) )
		.pipe( gulp.dest( outputDir ) );
});





/*
	$ gulp js: Runs all JS tasks
		A bit extensive, but it needs to concatenate certain files in a certain order
		The dependencies ensure everything is done in the right order
*/

gulp.task( 'js', [ 'js-umd' ] );


//	1) 	Copy all into dist dir
//		Exclude translations
//		Exclude navbars add-on
gulp.task( 'js-copy', function() {

	return gulp.src([
			inputDir + '/*/**/*.js',
			'!' + inputDir + '/**/translations/*.js',
			'!' + inputDir + '/addons/navbars/**/*.js'
		])
		.pipe( rename({ suffix: '.min' }) )
		.pipe( gulp.dest( outputDir ) );
});


//	2) 	Concatenate core
//		Can't use glob, needs to be in specific order
gulp.task( 'js-concat-core', [ 'js-copy' ], function() {

	return gulp.src([
			inputDir + '/core/oncanvas/jquery.mmenu.oncanvas.js',
			inputDir + '/core/offcanvas/jquery.mmenu.offcanvas.js',
			inputDir + '/core/scrollbugfix/jquery.mmenu.scrollbugfix.js',
			inputDir + '/core/screenreader/jquery.mmenu.screenreader.js'
		])
		.pipe( concat( 'jquery.mmenu.min.js' ) )
		.pipe( gulp.dest( outputDir ) );
});


//	3)	Concatenate translations
gulp.task( 'js-concat-translations', [ 'js-concat-core' ], function() {

	var streams = [],
		stream;

	for ( var t = 0; t < translations.length; t++ )
	{
		stream = gulp.src([
				inputDir + '/**/translations/jquery.mmenu.' + translations[ t ] + '.js'
			])
			.pipe( concat( 'jquery.mmenu.' + translations[ t ] + '.min.js' ) )
			.pipe( gulp.dest( outputDir + '/translations/' + translations[ t ] ) );

		streams.push( stream );
	}

	return ms.apply( this, streams );
});


//	4) 	Concatenate navbars add-on
gulp.task( 'js-concat-navbar', [ 'js-concat-translations' ], function() {

	return gulp.src([
			inputDir + '/addons/navbars/jquery.mmenu.navbars.js',
			inputDir + '/addons/navbars/**/*.js'
		])
		.pipe( concat( 'jquery.mmenu.navbars.min.js' ) )
		.pipe( gulp.dest( outputDir + '/addons/navbars' ) );
});


//	5) 	Concatenate all
gulp.task( 'js-concat-all', [ 'js-concat-navbar' ], function() {

	return gulp.src([
			outputDir + '/jquery.mmenu.min.js',
			outputDir + '/addons/**/*.js'
		])
		.pipe( concat( 'jquery.mmenu.all.min.js' ) )
		.pipe( gulp.dest( outputDir ) );
});


//	6)	Minify all
gulp.task( 'js-minify', [ 'js-concat-all' ], function() {

	return gulp.src([
			outputDir + '/**/*.min.js'
		])
		.pipe( uglify({ preserveComments: 'license' }) )
		.pipe( gulp.dest( outputDir ) );
});


//	7)	UMD core
gulp.task( 'js-umd', [ 'js-minify' ], function() {

	return gulp.src([
			outputDir + '/jquery.mmenu.min.js',
			outputDir + '/jquery.mmenu.all.min.js',
		])
		.pipe( umd({
			dependencies: function() { return [ {
				name 	: 'jquery',
				global 	: 'jQuery',
				param 	: 'jQuery'
			} ]; },
			exports: function() { return true; },
			namespace: sanitizeNamespaceForUmd
		}))
		.pipe( gulp.dest( outputDir ) );
});





/*
	$ gulp custom-css
*/

gulp.task( 'custom-css', [ 'custom-css-sass' ] );


//	1)	Create backup _variables.scss from original _variables.scss
gulp.task( 'custom-css-backup', function() {

	fs.stat( inputDir + '/scss/_variables.bu.scss', function( err, stat ) {
		if ( err != null )
		{
			return gulp.src( inputDir + '/scss/_variables.scss' )
				.pipe( concat( '_variables.bu.scss' ) )
				.pipe( gulp.dest( inputDir + '/scss' ) );
		}
	});
});


//	2)	Concatenate custom _variables.scss with backup _variables.scss
gulp.task( 'custom-css-set', [ 'custom-css-backup' ], function() {

	fs.stat( inputDir + '/scss/_variables.bu.scss', function( err, stat ) {
		if ( err == null )
		{
			return gulp.src([
					customDir + '/_variables.scss',
					inputDir  + '/scss/_variables.bu.scss' 
				])
				.pipe( concat( '_variables.scss' ) )
				.pipe( gulp.dest( inputDir + '/scss' ) );
		}
	});
});


//	3)	Compile css
gulp.task( 'custom-css-sass', [ 'custom-css-set' ], function() {

	return sass( inputDir + '/**/*.scss', { style: 'expanded' })
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( gulp.dest( outputDir ) );
});


//	x) Reset the css
gulp.task( 'custom-css-reset', function() {

	fs.stat( inputDir + '/scss/_variables.bu.scss', function( err, stat ) {
		if ( err == null )
		{
			return gulp.src([
					inputDir  + '/scss/_variables.bu.scss' 
				])
				.pipe( concat( '_variables.scss' ) )
				.pipe( gulp.dest( inputDir + '/scss' ) );
		}
	});
});





/*
	$ gulp custom-build
*/

gulp.task( 'custom-build', [ 'custom-build-umd' ] );


//	1)	Concatenate JS and CSS
gulp.task( 'custom-build-concat', function() {

	var builds 	= require( customDir + '/_builds.json' ),
		streams = [],
		stream;

	for ( var b = 0; b < builds.length; b++ )
	{

		var js  = [];
		var css = [];

		for ( var f in builds[ b ].files )
		{
			for ( var s = 0; s < builds[ b ].files[ f ].length; s++ )
			{
				var script = builds[ b ].files[ f ][ s ];

				js.push(  outputDir + '/' + f + '/' + script + '/jquery.mmenu.' + script + '.min.js' );
				css.push( outputDir + '/' + f + '/' + script + '/jquery.mmenu.' + script + '.css' );
			}
		}

		stream = gulp.src( js )
			.pipe( concat( builds[ b ].name + '.min.js' ) )
			.pipe( gulp.dest( customDir + '/' + outputDir ) );

		streams.push( stream );

		stream = gulp.src( css )
			.pipe( concat( builds[ b ].name + '.css' ) )
			.pipe( gulp.dest( customDir + '/' + outputDir ) );

		streams.push( stream );
	}

	return ms.apply( this, streams );
});


//	2)	UMD JS
gulp.task( 'custom-build-umd', [ 'custom-build-concat' ], function() {

	return gulp.src( customDir + '/' + outputDir + '/*.min.js' )
		.pipe( umd({
			dependencies: function() { return [ {
				name 	: 'jquery',
				global 	: 'jQuery',
				param 	: 'jQuery'
			} ]; },
			exports: function() { return true; },
			namespace: sanitizeNamespaceForUmd
		}))
		.pipe( gulp.dest( customDir + '/' + outputDir ) );
});

