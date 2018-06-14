/*	
 * jQuery mmenu counters add-on
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'counters';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shorthand options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					add		: opts,
					update	: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Refactor counter class
			this.bind( 'initListview:after',
				function( $panel )
				{
					var cntrclss = this.conf.classNames[ _ADDON_ ].counter;
					this.__refactorClass( $panel.find( '.' + cntrclss ), cntrclss, _c.counter );
				}
			);


			//	Add the counters
			if ( opts.add )
			{
				this.bind( 'initListview:after',
					function( $panel )
					{
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
									var $parent = $(this).data( _d.parent );
									if ( $parent )
									{
										if ( !$parent.children( '.' + _c.counter ).length )
										{
											$parent.prepend( $( '<em class="' + _c.counter + '" />' ) );
										}
									}
								}
							);
					}
				);
			}

			if ( opts.update )
			{
				var count = function( $panels )
				{
					$panels = $panels || this.$pnls.children( '.' + _c.panel );

					$panels.each(
						function()
						{
							var $panel 	= $(this),
								$parent = $panel.data( _d.parent );

							if ( !$parent )
							{
								return;
							}

							var $counter = $parent.children( 'em.' + _c.counter );
							if ( !$counter.length )
							{
								return;
							}

							$panel = $panel.children( '.' + _c.listview );
							if ( !$panel.length )
							{
								return;
							}

							$counter.html( that.__filterListItems( $panel.children() ).length );
						}
					);
				};

				this.bind( 'initListview:after'	, count );
				this.bind( 'updateListview'		, count );
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'counter' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add		: false,
		addTo	: 'panels',
		count	: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		counter: 'Counter'
	};


	var _c, _d, _e, glbl;

})( jQuery );