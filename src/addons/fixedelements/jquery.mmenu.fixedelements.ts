/*	
 * jQuery mmenu fixedElements add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'fixedElements';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			if ( !this.opts.offCanvas )
			{
				return;
			}

			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;

			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			var setPage = function( $page )
			{
				//	Fixed elements
				var _fixd = this.conf.classNames[ _ADDON_ ].fixed,
					$fixd = $page.find( '.' + _fixd );

				this.__refactorClass( $fixd, _fixd, 'slideout' );
				$fixd[ conf.elemInsertMethod ]( conf.elemInsertSelector );

				//	Sticky elements
				var _stck = this.conf.classNames[ _ADDON_ ].sticky,
					$stck = $page.find( '.' + _stck );

				this.__refactorClass( $stck, _stck, 'sticky' );

				$stck = $page.find( '.' + _c.sticky );

				if ( $stck.length )
				{
					this.bind( 
						'open:before',
						function()
						{
							var _s = glbl.$wndw.scrollTop();

							$stck.each(
								function()
								{
									$(this).css( 'top', parseInt( $(this).css( 'top' ), 10 ) + _s );
								}
							);

						}
					);
					this.bind(
						'close:finish',
						function()
						{
							$stck.css( 'top', '' );
						}
					);
				}
			};

			this.bind( 'setPage:after', setPage );
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'sticky' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		elemInsertMethod	: 'appendTo',
		elemInsertSelector	: 'body'
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		fixed 	: 'Fixed',
		sticky	: 'Sticky'
	};


	var _c, _d, _e, glbl;

})( jQuery );