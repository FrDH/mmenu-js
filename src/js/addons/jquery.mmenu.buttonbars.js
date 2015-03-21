/*	
 * jQuery mmenu buttonbars addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'buttonbars';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Bind functions to update
			this.bind( 'init',
				function( $panels )
				{
					//	Refactor buttonbar class
					this.__refactorClass( $('div', $panels), this.conf.classNames[ _ADDON_ ].buttonbar, 'buttonbar' );


					//	Add markup
					$('.' + _c.buttonbar, $panels)
						.each(
							function()
							{
								var $bbar = $(this),
									$btns = $bbar.children().not( 'input' ),
									$inpt = $bbar.children().filter( 'input' );

								$bbar.addClass( _c.buttonbar + '-' + $btns.length );
								
								$inpt
									.each(
										function()
										{
											var $inp = $(this),
												$lbl = $btns.filter( 'label[for="' + $inp.attr( 'id' ) + '"]' );
			
											if ( $lbl.length )
											{
												$inp.insertBefore( $lbl );
											}
										}
									);
							}
						);
				}
			);
		},

		//	add: fired once per page load
		add: function()
		{			
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;
	
			_c.add( 'buttonbar' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].configuration.classNames[ _ADDON_ ] = {
		buttonbar: 'Buttonbar'
	};


	var _c, _d, _e, glbl;

})( jQuery );