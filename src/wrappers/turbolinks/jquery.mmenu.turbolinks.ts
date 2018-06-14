/*	
 * jQuery mmenu Turbolinks wrapper
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'turbolinks';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		var classnames, $html;

		$(document)

			//	Store the HTML classnames onDocumentReady
			.on( 'turbolinks:before-visit',
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
			)

			//	Reset the HTML classnames and reset the $.mmenu.glbl variable on page:change
			.on( 'turbolinks:load',
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
	};

})( jQuery );
