Mmenu.addons.backButton = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}

	var opts : mmOptionsBackbutton = this.opts.backButton;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			close: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	opts = this.opts.backButton = jQuery.extend( true, {}, Mmenu.options.backButton, opts );
	//	/Extend shorthand options


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
						states.push( '#' + jQuery(this).attr( 'id' ) );
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
							this.openPanel( jQuery( hash ) );
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


//	Default options and configuration.
(Mmenu.options.backButton as mmOptionsBackbutton) = {
	close 	: false,
	open 	: false
};
