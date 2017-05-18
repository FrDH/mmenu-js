/*	
 * jQuery Mobile wrapper for jQuery mmenu
 * Include this file after including the jquery.mmenu plugin for default jQuery Mobile support.
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu';

	//	Vars
	var api: any = false;

	//	Set some defaults
	$[ _PLUGIN_ ].defaults.onClick.close = false;

	//	Set current page
	$[ _PLUGIN_ ].configuration.offCanvas.pageSelector = 'div.ui-page-active';

	//	Get api
	$(window).load(function() {
		api = $('.mm-menu').data( 'mmenu' );
	});

	//	Change pages
	$(window).load(function() {
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
	});

	//	When changing pages
	$(window).load(function() {
		if ( api )
		{
			$('body').on(
				'pagecontainerchange',
				function( e, args )
				{
					api.close();
					api.setPage( args.toPage );
				}
			);
		}
	});


})( jQuery );