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
	//	/Extend shorthand options


	this.opts.counters = Mmenu.extend( opts, Mmenu.options.counters );


	//	Refactor counter class
	this.bind( 'initListview:after', (
		panel : HTMLElement
	) => {
		var cntrclss = this.conf.classNames.counters.counter;
		Mmenu.refactorClass( panel.querySelector( '.' + cntrclss ), cntrclss, 'mm-counter' );
	});


	//	Add the counters
	if ( opts.add )
	{
		this.bind( 'initListview:after', (
			panel : HTMLElement
		) => {
			var $wrapper : JQuery;
			switch( opts.addTo )
			{
				case 'panels':
					$wrapper = Mmenu.$(panel);
					break;

				default:
					$wrapper = Mmenu.$(panel).filter( opts.addTo );
					break;
			}

			$wrapper.each(
				( w, wrapper ) => {
					var parent : HTMLElement = (wrapper as any).mmParent;
					if ( parent )
					{
						if ( !parent.querySelector( '.mm-counter' ) )
						{
							let counter = document.createElement( 'span' );
							counter.classList.add( 'mm-counter' );
							Mmenu.DOM.child( parent, '.mm-btn' ).prepend( counter );
						}
					}
				}
			);
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
				var parent : HTMLElement = (panel as any).mmParent;

				if ( !parent )
				{
					return;
				}

				var counter = parent.querySelector( '.mm-counter' );
				if ( !counter )
				{
					return;
				}

				var $listview = Mmenu.$(panel).children( '.mm-listview' );
				if ( !$listview.length )
				{
					return;
				}
				var listitems : HTMLElement[] = Array.prototype.slice.call( $listview.children() );
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