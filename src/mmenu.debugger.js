/**
 * Debugger for mmenu.js
 * Include this file after including the mmenu.js plugin to debug your menu.
 */
(function() {
    const _console = Mmenu.console || console || { error: function() {} };
    const deprecated = (depr, repl, vers) => {
        var msg = 'Mmenu: ' + depr + ' is deprecated';

        if (vers) {
            msg += ' as of version ' + vers;
        }
        if (repl) {
            msg += ', use ' + repl + ' instead';
        }
        msg += '.';

        _console.error(msg);
    };

    if (typeof Mmenu == 'undefined') {
        _console.warn(
            'Global variable "Mmenu" (needed for the debugger) not found!'
        );
        return;
    }

    /** Log deprecated warnings. */
    Mmenu.prototype._deprecatedWarnings = function() {
        /**
         * ----------------------------
         * Version 7.3 > 8.0
         * ----------------------------
         */

        /* API */

        //	These methods no longer accept a jQuery object as an argument,
        //		they now only accept a HTMLElement.
        [
            'setPage',
            'openPanel',
            'closePanel',
            'closeAllPanels',
            'setSelected'
        ].forEach(method => {
            this.bind(method + ':before', method => {
                if (typeof panel != 'undefined' && panel instanceof jQuery) {
                    deprecated(
                        'Passing a jQuery object as an argument to the "' +
                            method +
                            '" API method',
                        'a HTMLElement',
                        '8.0.0'
                    );
                }
            });
        });

        //	These methods no longer accept a jQuery object as an argument,
        //		they now only accept an array of HTMLElements.
        ['initPanels'].forEach(method => {
            this.bind(method + ':before', method => {
                if (typeof panel != 'undefined' && panel instanceof jQuery) {
                    deprecated(
                        'Passing a jQuery object as an argument to the "' +
                            method +
                            '" API method',
                        'a HTMLElement array',
                        '8.0.0'
                    );
                }
            });
        });

        /* OPTIONS */

        //	opts.navbars.navbar.height is removed in favor of specifying a different CSS variable (--mm-navbar-size ) for each navbar.
        if (this.opts.navbars) {
            this.opts.navbars.forEach(navbar => {
                if (typeof navbar.height !== 'undefined') {
                    deprecated(
                        'The "height" option in the "navbars" options.',
                        'the CSS variable "--mm-navbar-size"',
                        '8.0.0'
                    );
                }
            });
        }

        //	opts.dividers.fixed is removed, all dividers are now sticky by default.
        if (this.opts.dividers) {
            if (
                typeof this.opts.dividers == 'object' &&
                typeof this.opts.dividers.fixed !== 'undefined'
            ) {
                deprecated(
                    'The "fixed" option in the "dividers" options.',
                    null,
                    '8.0.0'
                );
            }
        }

        //	opts.iconbar.add is renamed to opts.iconbar.use.
        if (this.opts.iconbar) {
            if (
                typeof this.opts.iconbar == 'object' &&
                typeof this.opts.iconbar.add !== 'undefined'
            ) {
                deprecated(
                    'The "add" option in the "iconbar" options.',
                    'use',
                    '8.0.0'
                );

                //	Try to fix it.
                this.opts.iconbar.use = this.opts.iconbar.add;
            }
        }

        /* CONFIGURATION */

        //	conf.fixedElements.elemInsertMethod is changed to conf.fixedElements.fixed.insertMethod.
        if (typeof this.conf.fixedElements.elemInsertMethod != 'undefined') {
            deprecated(
                'The "elemInsertMethod" option in the "fixedElements" configuration',
                'fixed.insertMethod',
                '8.0.0'
            );

            //	Try to fix it.
            if (
                typeof this.conf.fixedElements.fixed.insertMethod == 'undefined'
            ) {
                this.conf.fixedElements.fixed.insertMethod = this.conf.fixedElements.elemInsertMethod;
            }
        }

        //	conf.fixedElements.elemInsertSelector is changed to conf.fixedElements.fixed.insertSelector.
        if (typeof this.conf.fixedElements.elemInsertMethod != 'undefined') {
            deprecated(
                'The "elemInsertSelector" option in the "fixedElements" configuration',
                'fixed.insertSelector',
                '8.0.0'
            );

            //	Try to fix it.
            if (
                typeof this.conf.fixedElements.fixed.insertSelector ==
                'undefined'
            ) {
                this.conf.fixedElements.fixed.insertSelector = this.conf.fixedElements.elemInsertSelector;
            }
        }

        //  conf.pageScroll.scrollOffset is deprecated in favor of using native element.scrollIntoView.
        if (typeof this.conf.pageScroll.scrollOffset != 'undefined') {
            deprecated(
                'The "scrollOffset" option in the "pageScroll" configuration',
                null,
                '8.0.0'
            );
        }
    };
})();
