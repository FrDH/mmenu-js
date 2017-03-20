/*	
 * Turbolinks (4 and down) wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default Turbolinks support.
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu';

	//	Vars
	var ready, classnames, $html;

	//	Store the HTML classnames onDocumentReady
	$(document).on(
		'ready',
		function()
		{
			$html = $('html');
			classnames = $html.attr( 'class' );
			classnames = $.grep(
				classnames.split( /\s+/ ),
				function( name )
				{
					return !/mm-/.test( name );
				}
			).join(' ');
		}
	);

	//	Reset the HTML classnames and reset the $.mmenu.glbl variable on page:change
	$(document).on(
		'page:load',
		function()
		{
			$html.attr( 'class', classnames );
			$[ _PLUGIN_ ].glbl = false;
		}
	);

})( jQuery );