Mmenu.addons.sectionIndexer = function(
	this : Mmenu
) {
	var opts = this.opts.sectionIndexer;


	//	Extend shorthand options
	if ( typeof opts == 'boolean' )
	{
		(opts as mmLooseObject) = {
			add: opts
		};
	}
	if ( typeof opts != 'object' )
	{
		(opts as mmLooseObject) = {};
	}
	//	/Extend shorthand options


	//opts = this.opts.sectionIndexer = jQuery.extend( true, {}, Mmenu.options.sectionIndexer, opts );
	this.opts.sectionIndexer = Mmenu.extend( opts, Mmenu.options.sectionIndexer );


	if ( !opts.add )
	{
		return;
	}


	this.bind( 'initPanels:after',
		function( 
			this	: Mmenu,
			$panels	: JQuery
		) {

			//	Set the panel(s)
			var $wrapper: JQuery;
			switch( opts.addTo )
			{
				case 'panels':
					 $wrapper = $panels;
					break;

				default:
					$wrapper = this.node.$menu.find( opts.addTo );
					$wrapper = $wrapper.filter( '.mm-panel' );
					break;
			}

			$wrapper
				.find( '.mm-listitem_divider' )
				.closest( '.mm-panel' )
				.addClass( 'mm-panel_has-sectionindexer' );


			//	Add the indexer, only if it does not allready excists
			if ( !this.node.$indx )
			{
				this.node.$indx = Mmenu.$( '<div class="mm-sectionindexer" />' )
					.prependTo( this.node.$menu )
					.append( 
						'<a href="#a">a</a>' +
						'<a href="#b">b</a>' +
						'<a href="#c">c</a>' +
						'<a href="#d">d</a>' +
						'<a href="#e">e</a>' +
						'<a href="#f">f</a>' +
						'<a href="#g">g</a>' +
						'<a href="#h">h</a>' +
						'<a href="#i">i</a>' +
						'<a href="#j">j</a>' +
						'<a href="#k">k</a>' +
						'<a href="#l">l</a>' +
						'<a href="#m">m</a>' +
						'<a href="#n">n</a>' +
						'<a href="#o">o</a>' +
						'<a href="#p">p</a>' +
						'<a href="#q">q</a>' +
						'<a href="#r">r</a>' +
						'<a href="#s">s</a>' +
						'<a href="#t">t</a>' +
						'<a href="#u">u</a>' +
						'<a href="#v">v</a>' +
						'<a href="#w">w</a>' +
						'<a href="#x">x</a>' +
						'<a href="#y">y</a>' +
						'<a href="#z">z</a>' );

				//	Scroll onMouseOver
				this.node.$indx
					.on( 'click.mm-sectionIndexer',
						'a',
						( e ) => {
							e.preventDefault();
						}
					)
					.on( 'mouseover.mm-sectionIndexer touchstart.mm-sectionIndexer',
						'a',
						( e ) => {
							var lttr = Mmenu.$(e.currentTarget).html(),
								$panl = this.node.$pnls.children( '.mm-panel_opened' ),
								$list = $panl.find( '.mm-listview' );

							var newTop = -1,
								oldTop = $panl.scrollTop();

							$panl.scrollTop( 0 );
							$list
								.children( '.mm-listitem_divider' )
								.not( '.mm-hidden' )
								.each(
									( i, elem ) => {
										if ( newTop < 0 &&
											lttr == Mmenu.$(elem).text().slice( 0, 1 ).toLowerCase()
										) {
											newTop = Mmenu.$(elem).position().top;
										}
									}
								);

							$panl.scrollTop( newTop > -1 ? newTop : oldTop );
						}
					);
			}


			//	Show or hide the indexer
			function update(
				this	 : Mmenu,
				$panel	?: JQuery
			) {
				$panel = $panel || this.node.$pnls.children( '.mm-panel_opened' );
				this.node.$menu[ ( $panel.hasClass( 'mm-panel_has-sectionindexer' ) ? 'add' : 'remove' ) + 'Class' ]( 'mm-menu_has-sectionindexer' );
			};

			this.bind( 'openPanel:start', 	update );
			this.bind( 'initPanels:after',	update );
		}
	);
};


//	Default options and configuration.
Mmenu.options.sectionIndexer = {
	add		: false,
	addTo	: 'panels'
};
