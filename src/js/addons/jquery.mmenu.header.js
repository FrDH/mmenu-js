/*	
 * jQuery mmenu header addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'header';


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
			if ( typeof opts.content == 'undefined' )
			{
				opts.content = [ 'prev', 'title', 'next' ];
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Add markup
			if ( opts.add )
			{
				if ( opts.content instanceof Array )
				{
					var $content = $( '<div />' );
					for ( var c = 0, l = opts.content.length; c < l; c++ )
					{
						switch ( opts.content[ c ] )
						{
							case 'prev':
							case 'next':
							case 'close':
								$content.append( '<a class="' + _c[ opts.content[ c ] ] + ' ' + _c.btn + '" href="#"></a>' );
								break;
							
							case 'title':
								$content.append( '<a class="' + _c.title + '"></a>' );
								break;
							
							default:
								$content.append( opts.content[ c ] );
								break;
						}
					}
					$content = $content.html();
				}
				else
				{
					var $content = opts.content;
				}

				$( '<div class="' + _c.header + '" />' )
					.prependTo( this.$menu )
					.append( $content );

				this.$menu
					.addClass( _c.hasheader );

				this.bind( 'init',
					function( $panel )
					{
						$panel.removeClass( _c.hasheader );
					}
				);
			}
			this.$header = this.$menu.children( '.' + _c.header );


			//	Update content
			if ( opts.update && this.$header && this.$header.length )
			{
				var $titl = this.$header.find( '.' + _c.title ),
					$prev = this.$header.find( '.' + _c.prev ),
					$next = this.$header.find( '.' + _c.next ),
					$clse = this.$header.find( '.' + _c.close );

				var update = function( $panl )
				{
					$panl = $panl || this.$menu.children( '.' + _c.current );

					//	Find title, prev and next
					var $ttl = $panl.find( '.' + this.conf.classNames[ _ADDON_ ].panelHeader ),
						$prv = $panl.find( '.' + this.conf.classNames[ _ADDON_ ].panelPrev ),
						$nxt = $panl.find( '.' + this.conf.classNames[ _ADDON_ ].panelNext ),
						$prt = $panl.data( _d.parent );

					var _ttl = $ttl.html(),
						_prv = $prv.attr( 'href' ),
						_nxt = $nxt.attr( 'href' ),
						_prt = false;

					var _prv_txt = $prv.html(),
						_nxt_txt = $nxt.html();

					if ( !_ttl )
					{
						_ttl = $panl.children( '.' + _c.header ).children( '.' + _c.title ).html();
					}

					if ( !_ttl )
					{
						_ttl = opts.title;
					}
					if ( !_prv )
					{
						_prv = $panl.children( '.' + _c.header ).children( '.' + _c.prev ).attr( 'href' );
					}

					switch ( opts.titleLink )
					{
						case 'anchor':
							var _prt = ( $prt ) ? $prt.children( 'a' ).not( '.' + _c.next ).attr( 'href' ) : false;
							break;
						
						case 'panel':
							var _prt = _prv;
							break;
					}

					$titl[ _prt ? 'attr' : 'removeAttr' ]( 'href', _prt );
					$titl[ _ttl ? 'removeClass' : 'addClass' ]( _c.hidden );
					$titl.html( _ttl );

					$prev[ _prv ? 'attr' : 'removeAttr' ]( 'href', _prv );
					$prev[ _prv || _prv_txt ? 'removeClass' : 'addClass' ]( _c.hidden );
					$prev.html( _prv_txt );

					$next[ _nxt ? 'attr' : 'removeAttr' ]( 'href', _nxt );
					$next[ _nxt || _nxt_txt ? 'removeClass' : 'addClass' ]( _c.hidden );
					$next.html( _nxt_txt );
				};

				this.bind( 'openPanel', update );
				this.bind( 'init',
					function()
					{
						update.call( this, this.$menu.children( '.' + _c.current ) );
					}
				);

				if ( this.opts.offCanvas )
				{
					var setPage = function( $page )
					{
						$clse.attr( 'href', '#' + $page.attr( 'id' ) );
					};
					setPage.call( this, glbl.$page );
					this.bind( 'setPage', setPage );
				}
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'hasheader close' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add			: false,
//		content		: [ 'prev', 'title', 'next' ],
		title		: 'Menu',
		titleLink	: 'panel',
		update		: false
	};
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		panelHeader	: 'Header',
		panelNext	: 'Next',
		panelPrev	: 'Prev'
	};


	var _c, _d, _e, glbl;

})( jQuery );