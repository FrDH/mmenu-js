(function( $ : JQueryStatic ) {

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
		$panel : JQuery
	) => {
		var cntrclss = this.conf.classNames.counters.counter;
		Mmenu.refactorClass( $panel.find( '.' + cntrclss ), cntrclss, 'mm-counter' );
	});


	//	Add the counters
	if ( opts.add )
	{
		this.bind( 'initListview:after', (
			$panel : JQuery
		) => {
			var $wrapper : JQuery;
			switch( opts.addTo )
			{
				case 'panels':
					$wrapper = $panel;
					break;

				default:
					$wrapper = $panel.filter( opts.addTo );
					break;
			}

			$wrapper.each(
				( i, elem ) => {
					var $parent : JQuery = (elem as any).mmParent;
					if ( $parent )
					{
						if ( !$parent.find( '.mm-counter' ).length )
						{
							$parent.children( '.mm-btn' ).prepend( $( '<span class="mm-counter" />' ) );
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
			$panels	?: JQuery
		) {
			$panels = $panels || Mmenu.$(this.node.pnls).children( '.mm-panel' );

			$panels.each(
				( i, elem ) => {
					var $panel 	: JQuery = $(elem),
						$parent : JQuery = (elem as any).mmParent;

					if ( !$parent )
					{
						return;
					}

					var $counter = $parent.find( '.mm-counter' );
					if ( !$counter.length )
					{
						return;
					}

					var $listview = $panel.children( '.mm-listview' );
					if ( !$listview.length )
					{
						return;
					}

					$counter.html( Mmenu.filterListItems( $listview.children() ).length.toString() );
				}
			);
		};

		this.bind( 'initListview:after'	, count );
		this.bind( 'updateListview'		, count );
	}
};

})( jQuery );


//	Default options and configuration.
Mmenu.options.counters = {
	add		: false,
	addTo	: 'panels',
	count	: false
};

Mmenu.configs.classNames.counters = {
	counter: 'Counter'
};