/*	
 * jQuery Mobile wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default jQuery Mobile support.
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu';

	//	Vars
	var apis: any[] = [];

	//	Set some defaults
	$[ _PLUGIN_ ].defaults.onClick.close = false;

	//	Set current page
	$[ _PLUGIN_ ].configuration.offCanvas.pageSelector = 'div.ui-page-active';

	//	Get api
	$(window).load(function() {
		$('.mm-menu').each(function() {
			apis.push( $(this).data( 'mmenu' ) );
		})
	});

	$(window).load(function() {

		//	Change pages
		$('body').on(
			'click',
			'.mm-menu a',
			function( e )
			{
				if ( !e.isDefaultPrevented() )
				{
					e.preventDefault();
					$( 'body' ).pagecontainer( 'change', this.href );
				}
			}
		);

		//	When changing pages
		$('body').on(
			'pagecontainerchange',
			function( e, args )
			{
				for ( var a = 0; a < apis.length; a++ )
				{
					if ( apis[ a ] && typeof apis[ a ].close == 'function' )
					{
						apis[ a ].close();
						apis[ a ].setPage( args.toPage );
					}
				}
			}
		);

	});


})( jQuery );