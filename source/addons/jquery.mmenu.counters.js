/*	
 * jQuery mmenu counters addon
 * @requires mmenu 4.0.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * Dual licensed under the MIT and GPL licenses.
 * http://en.wikipedia.org/wiki/MIT_License
 * http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'counters';


	$[ _PLUGIN_ ].prototype[ '_addon_' + _ADDON_ ] = function()
	{
		var that = this,
			opts = this.opts[ _ADDON_ ];

		var _c = $[ _PLUGIN_ ]._c,
			_d = $[ _PLUGIN_ ]._d,
			_e = $[ _PLUGIN_ ]._e;

		_c.add( 'counter noresults' );
		_e.add( 'update' );


		//	Extend options
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
		opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


		//	DEPRECATED
		if ( opts.count )
		{
			$[ _PLUGIN_ ].deprecated( 'the option "count" for counters, the option "update"' );
			opts.update = opts.count;
		}
		//	/DEPRECATED


		//	Refactor counter class
		this.__refactorClass( $('em.' + this.conf.counterClass, this.$menu), 'counter' );

		//	Add the counters
		if ( opts.add )
		{
			$('.' + _c.panel, this.$menu).each(
				function()
				{
					var $t = $(this),
						$p = $t.data( _d.parent );
	
					if ( $p )
					{
						var $c = $( '<em class="' + _c.counter + '" />' ),
							$a = $p.find( '> a.' + _c.subopen );

						if ( !$a.parent().find( 'em.' + _c.counter ).length )
						{
							$a.before( $c );
						}
					}
				}
			);
		}

		//	Bind custom events
		if ( opts.update )
		{
			$('em.' + _c.counter, this.$menu).each(
				function()
				{
					var $c = $(this),
						$s = $($c.next().attr( 'href' ), this.$menu);

					if ( !$s.is( '.' + _c.list ) )
					{
						$s = $s.find( '> .' + _c.list );
					}

					if ( $s.length )
					{
						$c.off( _e.update )
							.on( _e.update,
								function( e )
								{
									e.stopPropagation();
	
									var $lis = $s.children()
										.not( '.' + _c.label )
										.not( '.' + _c.subtitle )
										.not( '.' + _c.hidden )
										.not( '.' + _c.noresults );
	
									$c.html( $lis.length );
								}
							);
					}
				}
			).trigger( _e.update );
		}
	};

	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add		: false,
		update	: false
	};
	$[ _PLUGIN_ ].configuration.counterClass = 'Counter';


	//	Add to plugin
	$[ _PLUGIN_ ].addons = $[ _PLUGIN_ ].addons || [];
	$[ _PLUGIN_ ].addons.push( _ADDON_ );

})( jQuery );