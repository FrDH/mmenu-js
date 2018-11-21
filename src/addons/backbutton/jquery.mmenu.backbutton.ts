Mmenu.addons.backButton = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}

	var opts = this.opts.backButton,
		conf = this.conf.backButton;



	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		opts = {
			close: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		opts = {};
	}
	opts = jQuery.extend( true, {}, Mmenu.options.backButton, opts );
	
	var _menu  = '#' + this.node.$menu.attr( 'id' );

	//	Close menu
	if ( opts.close )
	{

		var states = [];

		function setStates(
			this : Mmenu
		) {
			states = [ _menu ];
			this.node.$pnls.children( '.mm-panel_opened-parent' )
				.add( this.node.$pnls.children( '.mm-panel_opened' ) )
				.each(
					function()
					{
						states.push( '#' + $(this).attr( 'id' ) );
					}
				);
		}

		this.bind( 'open:finish', function() {
			history.pushState( null, document.title, _menu );
		});
		this.bind( 'open:finish'		, setStates );
		this.bind( 'openPanel:finish'	, setStates );
		this.bind( 'close:finish',
			function()
			{
				states = [];
				history.back();
				history.pushState( null, document.title, location.pathname + location.search );
			}
		);

		jQuery(window).on( 'popstate',
			( e ) => {
				if ( this.vars.opened )
				{
					if ( states.length )
					{
						states = states.slice( 0, -1 );
						var hash = states[ states.length - 1 ];

						if ( hash == _menu )
						{
							this.close();
						}
						else
						{
							this.openPanel( $( hash ) );
							history.pushState( null, document.title, _menu );
						}
					}
				}
			}
		);
	}

	if ( opts.open )
	{
		jQuery(window).on( 'popstate',
			( e ) => {
				if ( !this.vars.opened && location.hash == _menu )
				{
					this.open();
				}
			}
		);
	}
};


//	Default options and configuration
Mmenu.options.backButton = {
	close 	: false,
	open 	: false
};
