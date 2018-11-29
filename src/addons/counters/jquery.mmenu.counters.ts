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
	opts = this.opts.counters = jQuery.extend( true, {}, Mmenu.options.counters, opts );
	//	/Extend shorthand options


	//	Refactor counter class
	this.bind( 'initListview:after',
		function( 
			this	: Mmenu,
			$panel	: JQuery
		) {
			var cntrclss = this.conf.classNames.counters.counter;
			Mmenu.refactorClass( $panel.find( '.' + cntrclss ), cntrclss, 'mm-counter' );
		}
	);


	//	Add the counters
	if ( opts.add )
	{
		this.bind( 'initListview:after',
			function( 
				this	: Mmenu,
				$panel	: JQuery
			) {
				var $wrapper;
				switch( opts.addTo )
				{
					case 'panels':
						$wrapper = $panel;
						break;
	
					default:
						$wrapper = $panel.filter( opts.addTo );
						break;
				}

				$wrapper
					.each(
						function()
						{
							var $parent = jQuery(this).data( 'mm-parent' );
							if ( $parent )
							{
								if ( !$parent.find( '.mm-counter' ).length )
								{
									$parent.children( '.mm-btn' ).prepend( jQuery( '<span class="mm-counter" />' ) );
								}
							}
						}
					);
			}
		);
	}

	if ( opts.count )
	{
		function count(
			this 	 : Mmenu,
			$panels	?: JQuery
		) {
			$panels = $panels || this.node.$pnls.children( '.mm-panel' );

			$panels.each(
				function()
				{
					var $panel 	= jQuery(this),
						$parent = $panel.data( 'mm-parent' );

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

					$counter.html( Mmenu.filterListItems( $listview.children() ).length );
				}
			);
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