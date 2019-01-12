Mmenu.wrappers.turbolinks = function(
	this : Mmenu
) {
	var classnames, html;

	Mmenu.$(document)

		//	Store the HTML classnames onDocumentReady
		.on( 'turbolinks:before-visit',
			() => {
				html = document.documentElement;
				classnames = html.getAttribute( 'class' );
				classnames = Mmenu.$.grep(
					classnames.split( /\s+/ ),
					( name: string ) => {
						return !/mm-/.test( name );
					}
				).join( ' ' );
			}
		)

		//	Reset the HTML classnames when changing pages
		.on( 'turbolinks:load',
			() => {
				if ( typeof html === 'undefined' )
				{
					return;
				}

				html.setAttribute( 'class', classnames );
			}
		);
};
