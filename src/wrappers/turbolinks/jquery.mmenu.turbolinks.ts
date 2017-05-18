/*	
 * Turbolinks (5 and up) wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default Turbolinks support.
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu';

	//	Vars
	var classnames, $html;

	//	Store the HTML classnames onDocumentReady
	$(document).on(
		'turbolinks:before-visit',
		function()
		{
			$html = $('html');
			classnames = $html.attr( 'class' );
			classnames = $.grep(
				classnames.split( /\s+/ ),
				function( name: string )
				{
					return !/mm-/.test( name );
				}
			).join( ' ' );
		}
	);

	//	Reset the HTML classnames and reset the $.mmenu.glbl variable on page:change
	$(document).on(
		'turbolinks:load',
		function()
		{
			if ( typeof $html === 'undefined' )
			{
				return;
			}

			$html.attr( 'class', classnames );
			$[ _PLUGIN_ ].glbl = false;
		}
	);

})( jQuery );