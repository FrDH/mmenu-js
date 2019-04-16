/*
	CSS tasks.
		*)  The includes, variables and mixins are concatenated into the "input" dir.
		**) For a custom build, the includes and variables are copied from the specified "custom input" dir (--i flag), into the "input" dir.
*/


const { src, dest, watch, series, parallel } = require( 'gulp' );

const sass 			= require( 'gulp-sass' );
const autoprefixer 	= require( 'gulp-autoprefixer' );
const cleancss		= require( 'gulp-clean-css' );
const concat 		= require( 'gulp-concat' );

const dirs			= require( './dirs' );
var dir = {};



/** Run all scripts. */
exports.all = CSSall = ( cb ) => {
	dir = dirs( false );

	series( 
		parallel( 
			CSSconcatMixins,
			CSSconcatIncludes,
			CSSconcatVariables,
		),
		CSScompile
	)( cb );
};

exports.custom = CSScustom = ( cb ) => {
	dir = dirs( true );

	const CSScompileCustom = cb => CSScompile( cb, 
		dir.build + '/mmenu.scss',
	);

	series( 
		parallel( 
			CSScopyIncludes,
			CSScopyVariables
		),
		CSScompileCustom
	)( cb );
};

/** Put a watch on all files. */
exports.watch = CSSwatch = ( cb ) => {
	dir = dirs( false );

	watch( dir.input + '/**/*.scss' )
		.on( 'change', ( path ) => {

			console.log( 'Change detected to .scss file "' + path + '"' );
			var cb = () => {
				console.log( 'CSS compiled and concatenated.' );
			};

			switch( true ) {
				//	Changing an include, a variable or a mixin potentially affects all .scss files:
				//		- run all CSS tasks.
				case path.indexOf( '_includes.scss' ) > -1:
				case path.indexOf( '_variables.scss' ) > -1:
				case path.indexOf( '_mixins.scss' ) > -1:
					CSSall( cb );
					break;

				//	Changing any other file should only affect the files in the same directory:
				//		- compile only the directory to css;
				//		- concatenate all.
				default:
					var files = path.split( '/' );
						files.pop();
						files.shift();
						files = files.join( '/' );

					var CSScompileOne = cb => CSScompile( cb, 
						dir.input + '/' + files + '/*.scss', 
						dir.output + '/' + files
					);

					series(
						CSScompileOne,
						CSScompile
					)( cb );
					break;
			}
		});

	cb();
};



// *) Concatenate includes into a single file.
const CSSconcatIncludes = ( cb ) => {
	var files  	= [
		dir.input + '/core/oncanvas/_includes.scss',	// Include oncanvas includes first.
		dir.input + '/core/**/_includes.scss',			// Include core add-ons includes next.
		dir.input + '/**/_includes.scss',				// Include the rest of the includes.
	'!'+dir.input + '/_includes.scss',					// Exclude the includes destination file.
	];

	return src( files )
		.pipe( concat( '_includes.scss' ) )
    	.pipe( dest( dir.input ) );
};

// *) Concatenate variables into a single file.
const CSSconcatVariables = ( cb ) => {
	var files  	= [
		dir.input + '/core/oncanvas/_variables.scss',	// Include oncanvas variables first.
		dir.input + '/core/**/_variables.scss',			// Include core add-ons variables next.
		dir.input + '/**/_variables.scss',				// Include the rest of the variables.
	'!'+dir.input + '/_variables.scss',					// Exclude the variables destination file.
	];

	return src( files )
		.pipe( concat( '_variables.scss' ) )
    	.pipe( dest( dir.input ) );
};

// Concatenate mixins into a single file.
const CSSconcatMixins = ( cb ) => {
	var files  	= [
		dir.input + '/core/oncanvas/_mixins.scss',		// Include oncanvas mixins first.
		dir.input + '/core/**/_mixins.scss',			// Include core add-ons mixins next.
		dir.input + '/**/_mixins.scss',					// Include the rest of the mixins.
	'!'+dir.input + '/_mixins.scss',					// Exclude the mixins destination file.
	];

	return src( files )
		.pipe( concat( '_mixins.scss' ) )
		.pipe( dest( dir.input ) );
};

// **) Copy includes from custom input into input.
const CSScopyIncludes = ( cb ) => {
	return src( dir.build + '/_includes.scss' )
		.pipe( dest( dir.input ) );
};

// **) Copy variables from custom input into input.
const CSScopyVariables = ( cb ) => {
	return src( dir.build + '/_variables.scss' )
		.pipe( dest( dir.input ) );
};

// Compile all (or some) SCSS files to CSS.
const CSScompile = ( cb, input, output ) => {
	return src( input || dir.input + '/**/*.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( dest( output || dir.output ) );
};
