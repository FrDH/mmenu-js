/*
	Tasks:

	$ gulp 					: Runs "css" and "js" tasks
	$ gulp watch			: Starts a watch on "css" and "js" tasks


	Flags:

	--output ../path/to 	: Sets the output directory to the specified directory
	--custom ../path/to 	: Creates a custom build using _build.json and _variables.scss from the specified directory


	Complete example:

	$ gulp --custom ../mmenu-custom --output ../my-custom-build
*/


var gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	uglify 			= require( 'gulp-uglify' ),
	rename 			= require( 'gulp-rename' ),
	concat 			= require( 'gulp-concat' ),
	umd				= require( 'gulp-umd' ),
	typescript		= require( 'gulp-typescript' ),
	merge			= require( 'merge-stream' ),
	fs 				= require( 'fs' );


var inputDir 		= 'src',
	outputDir 		= 'dist',
	customDir 		= null,
	translations	= [ 'nl', 'de' ];


function sanitizeNamespaceForUmd( file ) {
	path = file.path.split( '\\' ).join( '/' ).split( '/' );
	path = path[ path.length - 1 ];
	return path.split( '.' ).join( '_' );
}


function getOption( dir ) {
	var index = process.argv.indexOf( '--' + dir );
	if ( index > -1 )
	{
		var dir = process.argv[ index + 1 ];
		return ( dir && dir.slice( 0, 2 ) != '--' ) ? dir : false;
	}
	return false;
}


function start( type ) {

	var output = getOption( 'output' ),
		custom = getOption( 'custom' );

	if ( output ) {
		outputDir = output;
	}
	if ( custom ) {
		customDir = custom;
	}

	gulp.start( [ type + '-' + ( custom ? 'custom' : 'default' ) ] );
}




/*
	$ gulp
*/

gulp.task( 'default', function() {
	start( 'build' );	
});

gulp.task( 'build-default', [ 'default-set' ], function() {
	gulp.start( [ 'js', 'css' ] );
});

gulp.task( 'build-custom', [ 'custom-set' ], function() {
	gulp.start( [ 'build-custom-concat' ] );
});
gulp.task( 'build-custom-concat', [ 'js', 'css' ], function() {
	gulp.start( [ 'custom-build' ] );
});



/*
	$ gulp watch
*/

gulp.task( 'watch', function() {
	start( 'watch' );
});

gulp.task( 'watch-default', [ 'default-set' ], function() {
	gulp.watch( inputDir + '/**/*.scss'	, [ 'css' ] );
	gulp.watch( inputDir + '/**/*.ts'	, [ 'js'  ] );
});

gulp.task( 'watch-custom', [ 'custom-set' ], function() {
	gulp.watch( inputDir + '/**/*.scss'	, [ 'watch-custom-css' ] );
	gulp.watch( inputDir + '/**/*.ts'	, [ 'watch-custom-js'  ] );
});
gulp.task( 'watch-custom-css', [ 'css' ], function() {
	gulp.start( [ 'custom-build' ] );
});
gulp.task( 'watch-custom-js', [ 'js' ], function() {
	gulp.start( [ 'custom-build' ] );
});





/*
	$ gulp css
*/

gulp.task( 'css', [ 'css-concat-all' ] );


//	1)	Compile all SCSS to CSS
gulp.task( 'css-compile', function() {

	return gulp.src( inputDir + '/**/*.scss' )
    	.pipe( sass().on( 'error', sass.logError ) )
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
gulp.task( 'js-typescript', function() {

	return gulp.src([
			inputDir + '/*/**/*.ts',
			'!' + inputDir + '/**/translations/*.ts',
			'!' + inputDir + '/addons/navbars/**/*.ts'
		])
		.pipe( typescript() )
		.pipe( gulp.dest( outputDir ) );
});


//	2) 	Concatenate core
//		Can't use glob, needs to be in specific order
gulp.task( 'js-concat-core', [ 'js-typescript' ], function() {

	return gulp.src([
			outputDir + '/core/oncanvas/jquery.mmenu.oncanvas.js',
			outputDir + '/core/offcanvas/jquery.mmenu.offcanvas.js',
			outputDir + '/core/scrollbugfix/jquery.mmenu.scrollbugfix.js',
			outputDir + '/core/screenreader/jquery.mmenu.screenreader.js'
		])
		.pipe( concat( 'jquery.mmenu.js' ) )
		.pipe( gulp.dest( outputDir ) );
});


//	3)	Concatenate translations
gulp.task( 'js-concat-translations', [ 'js-concat-core' ], function() {

	var streams = [],
		stream;

	for ( var t = 0; t < translations.length; t++ )
	{
		stream = gulp.src([
				inputDir + '/**/translations/jquery.mmenu.' + translations[ t ] + '.ts'
			])
			.pipe( typescript() )
			.pipe( concat( 'jquery.mmenu.' + translations[ t ] + '.js' ) )
			.pipe( gulp.dest( outputDir + '/translations/' + translations[ t ] ) );

		streams.push( stream );
	}

	return merge.apply( this, streams );
});


//	4) 	Concatenate navbars add-on
gulp.task( 'js-concat-navbar', [ 'js-concat-translations' ], function() {

	return gulp.src([
			inputDir + '/addons/navbars/jquery.mmenu.navbars.ts',
			inputDir + '/addons/navbars/**/*.ts'
		])
		.pipe( typescript() )
		.pipe( concat( 'jquery.mmenu.navbars.js' ) )
		.pipe( gulp.dest( outputDir + '/addons/navbars' ) );
});


//	5) 	Concatenate all
gulp.task( 'js-concat-all', [ 'js-concat-navbar' ], function() {

	return gulp.src([
			outputDir + '/jquery.mmenu.js',
			outputDir + '/addons/**/*.js'
		])
		.pipe( concat( 'jquery.mmenu.all.js' ) )
		.pipe( gulp.dest( outputDir ) );
});


//	6)	Minify all
gulp.task( 'js-minify', [ 'js-concat-all' ], function() {

	return gulp.src([
			outputDir + '/**/*.js'
		])
		.pipe( uglify({ preserveComments: 'license' }) )
		.pipe( gulp.dest( outputDir ) );
});


//	7)	UMD
gulp.task( 'js-umd', [ 'js-minify' ], function() {

	return gulp.src([
			outputDir + '/jquery.mmenu.js',
			outputDir + '/jquery.mmenu.all.js',
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
	Custom tasks
*/


//	Create backup _variables.scss from original _variables.scss
gulp.task( 'custom-backup', function() {

	fs.stat( inputDir + '/scss/_variables.bu.scss', function( err, stat ) {
		if ( err != null )
		{
			return gulp.src( inputDir + '/scss/_variables.scss' )
				.pipe( concat( '_variables.bu.scss' ) )
				.pipe( gulp.dest( inputDir + '/scss' ) );
		}
	});
});


//	Concatenate custom _variables.scss with backup _variables.scss
gulp.task( 'custom-set', [ 'custom-backup' ], function() {

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


//	Reset the css
gulp.task( 'default-set', function() {

	fs.stat( inputDir + '/scss/_variables.bu.scss', function( err, stat ) {
		if ( err == null )
		{
			return gulp.src([
					inputDir  + '/scss/_variables.bu.scss' 
				])
				.pipe( rename( '_variables.scss' ) )
				.pipe( gulp.dest( inputDir + '/scss' ) );
		}
	});
});


//	Concatenate JS and CSS
gulp.task( 'custom-build', function() {

	var build 	= require( customDir + '/_build.json' ),
		streams = [],
		stream;

	var js  = [],
		css = [];

	for ( var f in build.files )
	{
		for ( var s = 0; s < build.files[ f ].length; s++ )
		{
			var script = build.files[ f ][ s ];

			js.push(  outputDir + '/' + f + '/' + script + '/jquery.mmenu.' + script + '.js' );
			css.push( outputDir + '/' + f + '/' + script + '/jquery.mmenu.' + script + '.css' );
		}
	}

	//	js
	stream = gulp.src( js )
		.pipe( concat( build.name + '.js' ) );

	if ( build.umd )
	{
		stream = stream.pipe( umd({
			dependencies: function() { return [ {
				name 	: 'jquery',
				global 	: 'jQuery',
				param 	: 'jQuery'
			} ]; },
			exports: function() { return true; },
			namespace: sanitizeNamespaceForUmd
		}));
	}
	stream = stream.pipe( gulp.dest( customDir + '/' ) );

	streams.push( stream );

	//	css
	stream = gulp.src( css )
		.pipe( concat( build.name + '.css' ) )
		.pipe( gulp.dest( customDir + '/' ) );

	streams.push( stream );

	return merge.apply( this, streams );
});

