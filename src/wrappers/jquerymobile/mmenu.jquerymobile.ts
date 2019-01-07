Mmenu.wrappers.jqueryMobile = function(
	this : Mmenu
) {

	this.opts.onClick.close = false;
	this.conf.offCanvas.page.selector = 'div.ui-page-active';

	//	When changing pages
	Mmenu.$('body').on(
		'pagecontainerchange', ( evnt, args ) => {
			if ( this.opts.offCanvas )
			{
				if ( typeof this.close == 'function' )
				{
					this.close();
				}
				if ( typeof this.close == 'function' )
				{
					this.setPage( args.toPage );
				}
			}
		});

	//	Change pages
	this.bind( 'initAnchors:after', () => {
		Mmenu.$('body').on(
			'click', '.mm-listview a', ( evnt ) => {
				if ( !evnt.isDefaultPrevented() )
				{
					evnt.preventDefault();
					Mmenu.$( 'body' )[ 'pagecontainer' ]( 'change', evnt.currentTarget.getAttribute( 'href' ) );
				}
			});
	});
};
