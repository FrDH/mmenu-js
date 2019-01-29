Mmenu.addons.counters = function(
	this : Mmenu
) {
	var opts = this.opts.counters;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			add		: opts,
			count	: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	if ( opts.addTo == 'panels' )
	{
		opts.addTo = '.mm-panel';
	}
	//	/Extend shorthand options


	this.opts.counters = Mmenu.extend( opts, Mmenu.options.counters );


	//	Refactor counter class
	this.bind( 'initListview:after', (
		panel : HTMLElement
	) => {
		var cntrclss = this.conf.classNames.counters.counter,
			counters = panel.querySelectorAll( '.' + cntrclss );

		counters.forEach(( counter ) => {
			Mmenu.refactorClass( (counter as HTMLElement), cntrclss, 'mm-counter' );
		});
	});


	//	Add the counters after a listview is initiated.
	if ( opts.add )
	{
		this.bind( 'initListview:after', (
			panel : HTMLElement
		) => {

			if ( !panel.matches( opts.addTo ) )
			{
				return;
			}

			var parent : HTMLElement = panel[ 'mmParent' ];
			if ( parent )
			{
				//	Check if no counter already excists.
				if ( !parent.querySelector( '.mm-counter' ) )
				{
					let counter = Mmenu.DOM.create( 'span.mm-counter' );

					let btn = Mmenu.DOM.children( parent, '.mm-btn' )[ 0 ];
					if ( btn )
					{
						btn.prepend( counter );
					}
				}
			}
		});
	}

	if ( opts.count )
	{
		function count(
			this 	 : Mmenu,
			panel	?: HTMLElement
		) {
			var panels = panel ? [ panel ] : Mmenu.DOM.children( this.node.pnls, '.mm-panel' );
			panels.forEach(( panel ) => {
				var parent : HTMLElement = panel[ 'mmParent' ];

				if ( !parent )
				{
					return;
				}

				var counter = parent.querySelector( '.mm-counter' );
				if ( !counter )
				{
					return;
				}

				var listitems : HTMLElement[] = [];
				Mmenu.DOM.children( panel, '.mm-listview' )
					.forEach(( listview ) => {
						listitems.push( ...Mmenu.DOM.children( listview ) );
					});

				counter.innerHTML = Mmenu.filterListItems( listitems ).length.toString();
			});
		};

		this.bind( 'initListview:after'	, count );
		this.bind( 'updateListview'		, count );
	}
};


//	Default options and configuration.
Mmenu.options.counters = {
	add		: false,
	addTo	: 'panels',
	count	: false
};

Mmenu.configs.classNames.counters = {
	counter: 'Counter'
};