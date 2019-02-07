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


	this.opts.backButton = Mmenu.extend( opts, Mmenu.options.backButton );


	var _menu = '#' + this.node.menu.id;

	//	Close menu
	if ( opts.close )
	{

		var states = [];

		function setStates(
			this : Mmenu
		) {
			states = [ _menu ];
			Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened, .mm-panel_opened-parent' )
				.forEach(( panel ) => {
					states.push( '#' + panel.id );
				});
		}

		this.bind( 'open:finish', () => {
			history.pushState( null, document.title, _menu );
		});
		this.bind( 'open:finish'		, setStates );
		this.bind( 'openPanel:finish'	, setStates );
		this.bind( 'close:finish'		, () => {
			states = [];
			history.back();
			history.pushState( null, document.title, location.pathname + location.search );
		});

		window.addEventListener( 'popstate', ( evnt ) => {
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
						this.openPanel( this.node.menu.querySelector( hash ) );
						history.pushState( null, document.title, _menu );
					}
				}
			}
		});
	}

	if ( opts.open )
	{
		window.addEventListener( 'popstate', ( evnt ) => {
			if ( !this.vars.opened && location.hash == _menu )
			{
				this.open();
			}
		});
	}
};


//	Default options and configuration.
Mmenu.options.backButton = {
	close 	: false,
	open 	: false
};
