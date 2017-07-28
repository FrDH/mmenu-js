/*	
 * jQuery mmenu scrollBugFix add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'scrollBugFix';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			if ( !$[ _PLUGIN_ ].support.touch || !this.opts.offCanvas || !this.opts.offCanvas.blockUI )
			{
				return;
			}


			//	Extend shorthand options
			if ( typeof opts == 'boolean' )
			{
				opts = {
					fix: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );

			if ( !opts.fix )
			{
				return;
			}

			this.bind( 'open:start',
				function()
				{
					this.$pnls.children( '.' + _c.opened ).scrollTop( 0 );
				}
			);
			this.bind( 'initMenu:after',
				function()
				{
					this[ '_initWindow_' + _ADDON_ ]();
				}
			);
  
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		fix: true
	};


	$[ _PLUGIN_ ].prototype[ '_initWindow_' + _ADDON_ ] = function()
	{
		var that = this;

	    //	Prevent body scroll
	    glbl.$docu
	    	.off( _e.touchmove + '-' + _ADDON_ )
	    	.on( _e.touchmove + '-' + _ADDON_,
		    	function( e )
		    	{
					if ( glbl.$html.hasClass( _c.opened ) )
					{
						e.preventDefault();
					}
		    	}
		    );

	    var scrolling = false;
	    glbl.$body
	    	.off( _e.touchstart + '-' + _ADDON_ )
	    	.on( _e.touchstart + '-' + _ADDON_,
		    	'.' + _c.panels + '> .' + _c.panel,
		    	function( e )
		    	{
			        if ( glbl.$html.hasClass( _c.opened ) )
			        {
			        	if ( !scrolling )
						{
						    scrolling = true;   
    
					        if ( e.currentTarget.scrollTop === 0 )
					        {
					            e.currentTarget.scrollTop = 1;
					        }
					        else if ( e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight )
					        {
					            e.currentTarget.scrollTop -= 1;
					        }

						    scrolling = false;
						}
			        }
		    	}
		    )
	 		.off( _e.touchmove + '-' + _ADDON_ )
	 		.on( _e.touchmove + '-' + _ADDON_,
		 		'.' + _c.panels + '> .' + _c.panel,
		 		function( e )
		 		{
			        if ( glbl.$html.hasClass( _c.opened ) )
			        {
				        if ( $(this)[ 0 ].scrollHeight > $(this).innerHeight() )
				        {
				        	e.stopPropagation();
				        }
			        }
		    	}
	    	);

		//	Fix issue after device rotation change
		glbl.$wndw
	    	.off( _e.orientationchange + '-' + _ADDON_ )
	    	.on( _e.orientationchange + '-' + _ADDON_,
	    		function()
	    		{
	    			that.$pnls
	    				.children( '.' + _c.opened )
			        	.scrollTop( 0 )
			        	.css({ '-webkit-overflow-scrolling': 'auto' })
			        	.css({ '-webkit-overflow-scrolling': 'touch' });
				}
	    	);
	};


	var _c, _d, _e, glbl;

})( jQuery );