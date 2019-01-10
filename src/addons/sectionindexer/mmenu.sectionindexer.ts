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


	this.opts.sectionIndexer = Mmenu.extend( opts, Mmenu.options.sectionIndexer );


	if ( !opts.add )
	{
		return;
	}


	this.bind( 'initPanels:after', (
		$panels	: JQuery
	) => {

		//	Set the panel(s)
		var $wrapper: JQuery;
		switch( opts.addTo )
		{
			case 'panels':
				 $wrapper = $panels;
				break;

			default:
				$wrapper = Mmenu.$(this.node.menu).find( opts.addTo );
				$wrapper = $wrapper.filter( '.mm-panel' );
				break;
		}

		$wrapper
			.find( '.mm-listitem_divider' )
			.closest( '.mm-panel' )
			.addClass( 'mm-panel_has-sectionindexer' );


		//	Add the indexer, only if it does not allready excists
		if ( !this.node.indx )
		{
			let indexer = document.createElement( 'div' );
			indexer.classList.add( 'mm-sectionindexer' );

			let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split( '' );
			alphabet.forEach(( letter ) => {
				indexer.innerHTML += `<a href="${letter}">${letter}</a>`;
			});

			this.node.menu.prepend( indexer );
			this.node.indx = indexer;

			//	Scroll onMouseOver
			Mmenu.$(this.node.indx)
				.on( 'click.mm-sectionIndexer', 'a', ( evnt ) => {
					evnt.preventDefault();
				})
				.on( 'mouseover.mm-sectionIndexer touchstart.mm-sectionIndexer', 'a', ( e ) => {
					var lttr = Mmenu.$(e.currentTarget).html(),
						$panl =  Mmenu.$(this.node.pnls).children( '.mm-panel_opened' ),
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
				});
		}


		//	Show or hide the indexer
		function update(
			this	 : Mmenu,
			$panel	?: JQuery
		) {
			$panel = $panel ||  Mmenu.$(this.node.pnls).children( '.mm-panel_opened' );
			this.node.menu.classList[ $panel[ 0 ].classList.contains( 'mm-panel_has-sectionindexer' ) ? 'add' : 'remove' ]( 'mm-menu_has-sectionindexer' );
		};

		this.bind( 'openPanel:start', 	update );
		this.bind( 'initPanels:after',	update );
	});
};


//	Default options and configuration.
Mmenu.options.sectionIndexer = {
	add		: false,
	addTo	: 'panels'
};
