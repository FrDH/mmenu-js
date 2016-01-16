/*	
 * jQuery mmenu scrollBugFix addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'scrollBugFix';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			if ( !$[ _PLUGIN_ ].support.touch || !this.opts.offCanvas || !this.opts.offCanvas.modal )
			{
				return;
			}


			//	Extend shortcut options
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


			var id = this.$menu.attr( 'id' ),
				scrolling = false;


			this.bind( 'opening',
				function()
				{
					this.$pnls.children( '.' + _c.current ).scrollTop( 0 );
				}
			);

		    //	Prevent body scroll
		    glbl.$docu
		    	.on( _e.touchmove,
			    	function( e )
			    	{
						if ( that.vars.opened )
						{
							e.preventDefault();
						}
			    	}
			    );

		    glbl.$body
		    	.on( _e.touchstart,
			    	'#' + id + '> .' + _c.panels + '> .' + _c.current,
			    	function( e )
			    	{
				        if ( that.vars.opened )
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
		 		.on( _e.touchmove,
			 		'#' + id + '> .' + _c.panels + '> .' + _c.current,
			 		function( e )
			 		{
				        if ( that.vars.opened )
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
		    	.on( _e.orientationchange,
		    		function()
		    		{
		    			that.$pnls
		    				.children( '.' + _c.current )
				        	.scrollTop( 0 )
				        	.css({ '-webkit-overflow-scrolling': 'auto' })
				        	.css({ '-webkit-overflow-scrolling': "touch" });
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


	var _c, _d, _e, glbl;

})( jQuery );