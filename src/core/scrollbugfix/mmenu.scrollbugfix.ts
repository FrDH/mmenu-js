Mmenu.addons.scrollBugFix = function( 
	this: Mmenu
) {
	//	The scrollBugFix add-on fixes a scrolling bug
	//		1) in an off-canvas menu 
	//		2) that -when opened- blocks the UI from interaction 
	//		3) on touch devices
	if ( !Mmenu.support.touch || 		// 3
		!this.opts.offCanvas  || 		// 1
		!this.opts.offCanvas.blockUI	// 2
	) {
		return;
	}


	var opts = this.opts.scrollBugFix;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		opts = {
			fix: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	Extend shorthand options


	//opts = this.opts.scrollBugFix = jQuery.extend( true, {}, Mmenu.options.scrollBugFix, opts );
	this.opts.scrollBugFix = Mmenu.extend( opts, Mmenu.options.scrollBugFix );


	if ( !opts.fix )
	{
		return;
	}


	//	When opening the menu, scroll to the top of the current opened panel.
	this.bind( 'open:start', () => {
		Mmenu.$(this.node.pnls).children( '.mm-panel_opened' ).scrollTop( 0 );
	});

	this.bind( 'initMenu:after', () => {

	    //	Prevent the body from scrolling
	    Mmenu.$(document)
	    	.off( 'touchmove.mm-scrollBugFix' )
	    	.on( 'touchmove.mm-scrollBugFix',
		    	( evnt ) => {
					if ( document.documentElement.matches( '.mm-wrapper_opened' ) )
					{
						evnt.preventDefault();
					}
		    	}
		    );

	    var scrolling = false;
	    Mmenu.$('body')
	    	.off( 'touchstart.mm-scrollBugFix' )
	    	.on( 'touchstart.mm-scrollBugFix',
		    	'.mm-panels > .mm-panel',
		    	( evnt ) => {
		    		var panel = evnt.currentTarget;
			        if ( document.documentElement.matches( '.mm-wrapper_opened' ) )
			        {
			        	if ( !scrolling )
						{
						    scrolling = true;   

					        if ( panel.scrollTop === 0 )
					        {
					            panel.scrollTop = 1;
					        }
					        else if ( panel.scrollHeight === panel.scrollTop + panel.offsetHeight )
					        {
					            panel.scrollTop -= 1;
					        }

						    scrolling = false;
						}
			        }
		    	}
		    )
	 		.off( 'touchmove.mm-scrollBugFix' )
	 		.on( 'touchmove.mm-scrollBugFix',
		 		'.mm-panels > .mm-panel',
		 		( evnt ) => {
			        if ( document.documentElement.matches( '.mm-wrapper_opened' ) )
			        {
			        	var panel = evnt.currentTarget;
				        if ( panel.scrollHeight > panel.clientHeight )
				        {
				        	evnt.stopPropagation();
				        }
			        }
		    	}
	    	);

		//	Fix issue after device rotation change
		Mmenu.$('window')
	    	.off( 'orientationchange.mm-scrollBugFix' )
	    	.on( 'orientationchange.mm-scrollBugFix',
	    		() => {
	    			Mmenu.$(this.node.pnls)
	    				.children( '.mm-panel_opened' )
			        	.scrollTop( 0 )
			        	.css({ '-webkit-overflow-scrolling': 'auto' })
			        	.css({ '-webkit-overflow-scrolling': 'touch' });
				}
	    	);
	});
};


//	Default options and configuration.
Mmenu.options.scrollBugFix = {
	fix: true
};
