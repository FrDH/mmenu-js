Mmenu.addons.backButton = function(
	this : Mmenu
) {
	if ( !this.opts.offCanvas )
	{
		return;
	}

	var opts = this.opts.backButton;


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
	//	/Extend shorthand options


	//opts = this.opts.backButton = jQuery.extend( true, {}, Mmenu.options.backButton, opts );
	this.opts.backButton = Mmenu.extend( opts, Mmenu.options.backButton );


	var _menu = '#' + this.node.$menu[ 0 ].id;

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
					( i, elem ) => {
						states.push( '#' + elem.id );
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

		Mmenu.$(window).on( 'popstate',
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
							this.openPanel( Mmenu.$( hash ) );
							history.pushState( null, document.title, _menu );
						}
					}
				}
			}
		);
	}

	if ( opts.open )
	{
		Mmenu.$(window).on( 'popstate',
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
Mmenu.options.backButton = {
	close 	: false,
	open 	: false
};
