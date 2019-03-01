import Mmenu from './../oncanvas/mmenu.oncanvas';
import options from './_options';

Mmenu.options.scrollBugFix = options;


export default function( 
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


	var options = this.opts.scrollBugFix;


	//	Extend shorthand options
	if ( typeof options == 'boolean' ) {
		options = {
			fix: options
		};
	}
	if ( typeof options != 'object' ) {
		(options as mmLooseObject) = {};
	}
	//	Extend shorthand options


	this.opts.scrollBugFix = Mmenu.extend( options, Mmenu.options.scrollBugFix );


	if ( !options.fix ) {
		return;
	}


	//	When opening the menu, scroll to the top of the current opened panel.
	this.bind( 'open:start', () => {
		Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ].scrollTop = 0;
	});

	this.bind( 'initMenu:after', () => {

	    //	Only needs to be done once per page.
	    if ( !this.vars.scrollBugFixed ) {
		    let scrolling = false;

	    	//	Prevent the body from scrolling.
		    document.addEventListener( 'touchmove', ( evnt ) => {
		    	if ( document.documentElement.matches( '.mm-wrapper_opened' ) ) {
					evnt.preventDefault();
				}
		    });

		    document.body.addEventListener( 'touchstart', ( evnt ) => {
		    	var panel = (evnt.target as HTMLElement);

				if ( !panel.matches( '.mm-panels > .mm-panel' ) ) {
					return;
				}

		        if ( document.documentElement.matches( '.mm-wrapper_opened' ) ) {
		        	if ( !scrolling ) {
						//	Since we're potentially scrolling the panel in the onScroll event, 
						//	this little hack prevents an infinite loop.
					    scrolling = true;   

				        if ( panel.scrollTop === 0 ) {
				            panel.scrollTop = 1;
				        } else if ( panel.scrollHeight === panel.scrollTop + panel.offsetHeight ) {
				            panel.scrollTop -= 1;
				        }

				        //	End of infinite loop preventing hack.
					    scrolling = false;
					}
		        }
		    });

		    document.body.addEventListener( 'touchmove', ( evnt ) => {
		    	var panel = (evnt.target as HTMLElement);

		    	if ( !panel.matches( '.mm-panels > .mm-panel' ) ) {
					return;
				}

				if ( document.documentElement.matches( '.mm-wrapper_opened' ) ) {
			        if ( panel.scrollHeight > panel.clientHeight ) {
			        	evnt.stopPropagation();
			        }
		        }
		    });
	    }
	    this.vars.scrollBugFixed = true;


		//	Fix issue after device rotation change.
		window.addEventListener( 'orientationchange', ( evnt ) => {
			var panel = Mmenu.DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ];
			panel.scrollTop = 0;

			//	Apparently, changing the overflow-scrolling property triggers some event :)
			panel.style[ '-webkit-overflow-scrolling'] = 'auto';
			panel.style[ '-webkit-overflow-scrolling'] = 'touch';
		});
	});
};
