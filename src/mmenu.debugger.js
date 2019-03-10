/**
 * Debugger for mmenu.js
 * Include this file after including the mmenu.js plugin to debug your menu.
 */
(function() {

	const _console = Mmenu.console || console || { error: function() {} };
	const deprecated = ( depr, repl, vers ) => {
		var msg = 'Mmenu: ' + depr + ' is deprecated';

		if ( vers ) {
			msg += ' as of version ' + vers;
		}
		if ( repl ) {
			msg += ', use ' + repl + ' instead';
		}
		msg += '.';

		_console.error( msg );
	}


	if ( typeof Mmenu == 'undefined' ) {
		_console.warn( 'Global variable "Mmenu" (needed for the debugger) not found!' );
		return;
	}


	/** Log deprecated warnings. */
	Mmenu.prototype._deprecatedWarnings = function() {


		/**
		 * ----------------------------
		 * Version 8.0
		 * ----------------------------
		 */


		//	These methods no longer accept a jQuery object as an argument, 
		//		they now only accept a HTMLElement.
		['setPage', 'openPanel', 'closePanel', 'closeAllPanels', 'setSelected']
			.forEach(( method ) => {
				this.bind( method + ':before', ( method ) => {
					if ( typeof panel != 'undefined' && 
						panel instanceof jQuery
					) {
						deprecated( 
							'Passing a jQuery object as an argument to the "' + method + '" API method',
							'a HTMLElement',
							'8.0.0'
						);
					}
				});
			});

		//	These methods no longer accept a jQuery object as an argument, 
		//		they now only accept an array of HTMLElements.
		['initPanels']
			.forEach(( method ) => {
				this.bind( method + ':before', ( method ) => {
					if ( typeof panel != 'undefined' && 
						panel instanceof jQuery
					) {
						deprecated( 
							'Passing a jQuery object as an argument to the "' + method + '" API method',
							'an array of HTMLElement',
							'8.0.0'
						);
					}
				});
			});


		//	conf.fixedElements.elemInsertMethod was changed to conf.fixedElements.fixed.insertMethod
		if ( typeof this.conf.fixedElements.elemInsertMethod != 'undefined' ) {
			deprecated(
				'The "elemInsertMethod" option in the "fixedElements" configuration object',
				'fixed.insertMethod',
				'8.0.0'
			);

			//	Try to fix it.
			if ( typeof this.conf.fixedElements.fixed.insertMethod == 'undefined' ) {
				this.conf.fixedElements.fixed.insertMethod = this.conf.fixedElements.elemInsertMethod;
			}
		}

		//	conf.fixedElements.elemInsertSelector was changed to conf.fixedElements.fixed.insertSelector
		if ( typeof this.conf.fixedElements.elemInsertMethod != 'undefined' ) {
			deprecated(
				'The "elemInsertSelector" option in the "fixedElements" configuration object',
				'fixed.insertSelector',
				'8.0.0'
			);

			//	Try to fix it.
			if ( typeof this.conf.fixedElements.fixed.insertSelector == 'undefined' ) {
				this.conf.fixedElements.fixed.insertSelector = this.conf.fixedElements.elemInsertSelector;
			}
		}
	};

})();