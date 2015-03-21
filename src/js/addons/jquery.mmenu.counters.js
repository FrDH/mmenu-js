/*	
 * jQuery mmenu counters addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'counters';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shortcut options
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
			this.bind( 'init',
				function( $panels )
				{
					this.__refactorClass( $('em', $panels), this.conf.classNames[ _ADDON_ ].counter, 'counter' );
				}
			);


			//	Add the counters
			if ( opts.add )
			{
				this.bind( 'init',
					function( $panels )
					{
						$panels
							.each(
								function()
								{
									var $prnt = $(this).data( _d.parent );
									if ( $prnt )
									{
										if ( !$prnt.children( 'em.' + _c.counter ).length )
										{
											$prnt.prepend( $( '<em class="' + _c.counter + '" />' ) );
										}
									}
								}
							);
					}
				);
			}

			if ( opts.update )
			{
				this.bind( 'update',
					function()
					{
						this.$menu
							.find( '.' + _c.panel )
							.each(
								function()
								{
									var $panl = $(this),
										$prnt = $panl.data( _d.parent );

									if ( !$prnt )
									{
										return;
									}

									var $cntr = $prnt.children( 'em.' + _c.counter );
									if ( !$cntr.length )
									{
										return;
									}

									$panl = $panl.children( '.' + _c.listview );
									if ( !$panl.length )
									{
										return;
									}

									$cntr.html( that.__filterListItems( $panl.children() ).length );
								}
							);
					}
				);
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'counter search noresultsmsg' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add		: false,
		update	: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		counter: 'Counter'
	};


	var _c, _d, _e, glbl;

})( jQuery );