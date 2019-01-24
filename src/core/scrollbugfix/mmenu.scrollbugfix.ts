Mmenu.addons.scrollBugFix = function( 
	this: Mmenu
) {
	//	The scrollBugFix add-on fixes a scrolling bug
	//		1) on touch devices
	//		2) in an off-canvas menu 
	//		3) that -when opened- blocks the UI from interaction 
	if ( !Mmenu.support.touch || 		// 1
		!this.opts.offCanvas  || 		// 2
		!this.opts.offCanvas.blockUI	// 3
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


	this.opts.scrollBugFix = Mmenu.extend( opts, Mmenu.options.scrollBugFix );


	if ( !opts.fix )
	{
		return;
	}


	//	When opening the menu, scroll to the top of the current opened panel.
	this.bind( 'open:start', () => {
		Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ].scrollTop = 0;
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
							//	Since we're potentially scrolling the panel in the onScroll event, 
							//	this little hack prevents an infinite loop.
						    scrolling = true;   

					        if ( panel.scrollTop === 0 )
					        {
					            panel.scrollTop = 1;
					        }
					        else if ( panel.scrollHeight === panel.scrollTop + panel.offsetHeight )
					        {
					            panel.scrollTop -= 1;
					        }

					        //	End of infinite loop preventing hack.
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
console.log(panel)
				        if ( panel.scrollHeight > panel.clientHeight )
				        {
				        	evnt.stopPropagation();
				        }
			        }
		    	}
	    	);

		//	Fix issue after device rotation change
		Mmenu.$('window')
	    	.on( 'orientationchange.mm-scrollBugFix',
	    		( evnt ) => {
	    			var panel = Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ];
	    			panel.scrollTop = 0;

	    			//	Apparently, changing the overflow-scrolling property triggers some event :)
	    			panel.style[ '-webkit-overflow-scrolling'] = 'auto';
	    			panel.style[ '-webkit-overflow-scrolling'] = 'touch';
				}
	    	);
	});
};


//	Default options and configuration.
Mmenu.options.scrollBugFix = {
	fix: true
};
