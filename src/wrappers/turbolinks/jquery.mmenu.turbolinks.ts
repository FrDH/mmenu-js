Mmenu.wrappers.turbolinks = function(
	this : Mmenu
) {
	var classnames, $html;

	Mmenu.$(document)

		//	Store the HTML classnames onDocumentReady
		.on( 'turbolinks:before-visit',
			() => {
				$html = Mmenu.$('html');
				classnames = $html[ 0 ].getAttribute( 'class' );
				classnames = Mmenu.$.grep(
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

				$html[ 0 ].setAttribute( 'class', classnames );
			}
		);
};
