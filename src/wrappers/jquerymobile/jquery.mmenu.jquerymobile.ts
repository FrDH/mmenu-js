/*	
 * jQuery mmenu jQuery Mobile wrapper
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _WRAPPR_ = 'jqueryMobile';


	$[ _PLUGIN_ ].wrappers[ _WRAPPR_ ] = function()
	{
		var that = this;

		this.opts.onClick.close = false;
		this.conf.offCanvas.pageSelector = 'div.ui-page-active';

		//	When changing pages
		$('body').on(
			'pagecontainerchange',
			function( e, args )
			{
				if ( typeof that.close == 'function' )
				{
					that.close();
					that.setPage( args.toPage );
				}
			}
		);

		//	Change pages
		this.bind( 'initAnchors:after',
			function()
			{
				$('body').on(
					'click',
					'.mm-listview a',
					function( e )
					{
						if ( !e.isDefaultPrevented() )
						{
							e.preventDefault();
							$( 'body' )[ 'pagecontainer' ]( 'change', this.href );
						}
					}
				);
			}
		);
	};

})( jQuery );
