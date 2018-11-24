Mmenu.wrappers.turbolinks = function(
	this : Mmenu
) {
	var classnames, $html;

	jQuery(document)

		//	Store the HTML classnames onDocumentReady
		.on( 'turbolinks:before-visit',
			() => {
				$html = jQuery('html');
				classnames = $html.attr( 'class' );
				classnames = jQuery.grep(
					classnames.split( /\s+/ ),
					function( name: string )
					{
						return !/mm-/.test( name );
					}
				).join( ' ' );
			}
		)

		//	Reset the HTML classnames when changing pages
		.on( 'turbolinks:load',
			() => {
				if ( typeof $html === 'undefined' )
				{
					return;
				}

				$html.attr( 'class', classnames );
			}
		);
};
