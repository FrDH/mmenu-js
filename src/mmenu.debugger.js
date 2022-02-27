/**
 * Debugger for mmenu.js
 * Include this file after including the mmenu.js plugin to debug your menu.
 */
(function () {
    const _console = Mmenu.console ||
        console || {
        log: function () { },
        warn: function () { },
        error: function () { },
        group: function () { },
        groupEnd: function () { }
    };

    const warnings = [];
    const deprecated = (depr, repl, vers) => {
        var msg = 'Mmenu: ' + depr + ' is deprecated';

        if (vers) {
            msg += ' as of version ' + vers;
        }
        if (repl) {
            msg += ', use ' + repl + ' instead';
        }
        msg += '.';

        warnings.push(msg);
    };

    if (typeof Mmenu == 'undefined') {
        _console.error(
            'Global variable "Mmenu" (needed for the debugger) not found!'
        );
        return;
    }

    /** Log deprecated warnings. */
    Mmenu.prototype._deprecatedWarnings = function () {
        /**
         * ----------------------------
         * Version 9.0 > 9.1
         * ----------------------------
         */

        /* Extensions */

        //  Removed all extensions.
        if (this.opts.extensions) {
            deprecated(
                `The "Extension" option`,
                '9.1.0'
            );
        }

        // Removed position extensions.
        [
            'position-right',
            'position-front',
            'position-top',
            'position-bottom'
        ].forEach(ext => {
            Object.keys(this.opts.extensions).forEach(key => {
                if (this.opts.extensions[key].includes(ext)) {
                    deprecated(
                        `The "${ext}" extension`,
                        'the "offcanvas.position" option',
                        '9.1.0'
                    );
                }
            });
        });
        

        /**
         * ----------------------------
         * Version 8.5 > 9.0
         * ----------------------------
         */

        /* Add-ons */

        //  Removed add-ons.
        [
            'screenreader',
            'keyboardNavigation',
            'autoheight',
            'columns',
            'dividers',
            'dropdown',
            'fixedelements',
            'lazysubmenus'
        ].forEach(addon => {
            if (this.opts[addon]) {
                deprecated(
                    `The "${addon}" add-on`,
                    null,
                    '9.0.0'
                );
            }
            if (this.conf[addon]) {
                deprecated(
                    `The "${addon}" add-on`,
                    null,
                    '9.0.0'
                );
            }
        });

        //  Searchfield changes
        [
            'cancel',
            'panel'
        ].forEach(option => {
            if (typeof this.opts.searchfield[option] !== 'undefined') {
                deprecated(
                    `The "${option}" option for the "searchfield" add-on`,
                    `The "${option}" configuration option`,
                    '9.0.0'
                )
            }
        });
        
        [
            'search',
            'showSubPanels',
            'showTextItems'
        ].forEach(option => {
            if (typeof this.opts.searchfield[option] !== 'undefined') {
                deprecated(
                    `The "${option}" option for the "searchfield" add-on`,
                    null,
                    '9.0.0'
                )
            }
        });

        //  Counters "addTo" and "count" are removed.
        if (this.opts.counters.addTo) {
            ['addTo', 'count'].forEach(option => {
                deprecated(
                    `The "${option}" options for the "counters" add-on`,
                    null,
                    '9.0.0'
                );
            });
        };

        /* Extensions */

        // Removed extensions.
        [
            'borderstyle',
            'effects',
            'listview',
            'multiline',
            'popup',
            'shadows'
        ].forEach(ext => {
            Object.keys(this.opts.extensions).forEach(key => {
                if (this.opts.extensions[key].includes(ext)) {
                    deprecated(
                        `The "${ext}" extension`,
                        'custom CSS',
                        '9.0.0'
                    );
                }
            });
        });

        /* Config */

        //  Prev classnames removed from navbars add-on.
        if (
            this.conf.classNames.prev ||
            this.node.menu.querySelector('.Prev')
        ) {
            deprecated(
                'Predefining a back button for navbars',
                null,
                '9.0.0'
            );
        }

        //  Title classnames removed from navbars add-on.
        if (
            this.conf.classNames.title ||
            this.node.menu.querySelector('.Title')
        ) {
            deprecated(
                'Predefining a title for navbars',
                null,
                '9.0.0'
            );
        }

        /* Wrappers */

        //  Removed wrappers.
        [
            'angular',
            'bootstrap',
            'magento',
            'olark',
            'turbolinks',
            'wordpress'
        ].forEach(wrpr => {
            if (this.opts.wrappers.includes(wrpr)) {
                deprecated(
                    `The "${wrpr}" wrapper`,
                    null,
                    '9.0.0'
                );
            }
        });

        /* API */

        //	Removed API methods.
        [
            'initPanels'
        ].forEach(method => {
            this.bind(method + ':before', () => {
                deprecated(
                    `The "${method}" API method`,
                    null,
                    '9.0.0'
                );
            });
        });


        /**
         * ----------------------------
         * Version 8.4 > 8.5
         * ----------------------------
         */

        /* Add-ons */

        //  Navbars "next" content is removed.
        if (this.opts.navbars) {
            this.opts.navbars.forEach(navbar => {
                if (navbar.content.includes('next')) {
                    deprecated(
                        'The "next" content for the "navbars" add-on',
                        null,
                        '8.5.0'
                    );
                }
            });
        }

        /* Extensions */

        // Removed the extensions.
        ['tileview'].forEach(ext => {
            Object.keys(this.opts.extensions).forEach(key => {
                if (this.opts.extensions[key].includes(ext)) {
                    deprecated(
                        `The "${ext}" extension`,
                        'custom CSS',
                        '8.5.0'
                    );
                }
            });
        });

        /**
         * ----------------------------
         * Version 8.3 > 8.4
         * ----------------------------
         */

        /* Config */

        //  Styling listitems with "spacer" is removed.
        if (
            this.conf.classNames.spacer ||
            this.node.menu.querySelector('.Spacer')
        ) {
            deprecated(
                'Styling a listitem with "Spacer"',
                'custom CSS',
                '8.4.0'
            );
        }

        /**
         * ----------------------------
         * Version 8.2 > 8.3
         * ----------------------------
         */

        /* OPTIONS */

        //  The navbar.title option can no longer be a function.
        if (typeof this.opts.navbar.title == 'function') {
            deprecated(
                'A function for the "navbar.title" option',
                'a custom JS loop',
                '8.3.0'
            );

            //  Prevent an error.
            this.opts.navbar.title = Mmenu.options.navbar.title;
        }

        /* ADD-ONS */

        //  New Drag add-on with lesser options.
        if (this.opts.drag) {
            //  Swiping to close panels no longer supported.
            if (this.opts.drag.panels) {
                deprecated(
                    'Swiping to close panels using the "drag" add-on',
                    null,
                    '8.3.0'
                );
            }

            //  "drag.menu" Suboptions now are the "drag" options.
            if (this.opts.drag.menu) {
                deprecated(
                    'The "menu" options for the "drag" add-on',
                    'the "drag" option',
                    '8.3.0'
                );
            }
        }

        // The dividers.type option is removed.
        if (this.opts.dividers) {
            if (this.opts.dividers.type == 'light') {
                deprecated(
                    'The "type" option for the "dividers" add-on',
                    'custom CSS',
                    '8.3.0'
                );
            }
        }

        /* EXTENSIONS */

        // Removed panel-scoped extensions.
        [
            'mm-panel-border-none',
            'mm-panel-border-full',
            'mm-panel_listview-justify',
            'mm-panel-slide-0',
            'mm-panel-slide-100'
        ].forEach(ext => {
            if (this.node.menu.querySelector(ext)) {
                deprecated(
                    `Using the classname ${ext} on a specific panel.`,
                    'custom CSS',
                    '8.3.0'
                );
            }
        });

        //  Removed (parts of) extensions.
        [
            'border-offset',
            'fx-menu-fade',
            'fx-menu-zoom',
            'fx-panels-slide-up',
            'fx-panels-slide-right',
            'fx-panels-zoom',
            'fx-listitems-drop',
            'fx-listitems-fade',
            'fx-listitems-slide'
        ].forEach(ext => {
            Object.keys(this.opts.extensions).forEach(key => {
                if (this.opts.extensions[key].includes(ext)) {
                    deprecated(
                        `The "${ext}" extension`,
                        'custom CSS',
                        '8.3.0'
                    );
                }
            });
        });

        /**
         * ----------------------------
         * Version 8.1 > 8.2
         * ----------------------------
         */

        /* API */

        //  Deprecated API methods.
        this.bind('initPanels:deprecated', method => {
            deprecated('The "initPanels" API method', '"initPanel"', '8.2.0');
        });

        /**
         * ----------------------------
         * Version 8.0 > 8.1
         * ----------------------------
         */

        /* CONFIGURATION */

        //	conf.clone is moved to conf.offCanvas.clone.
        if (typeof this.conf.clone != 'undefined') {
            deprecated(
                'The "clone" configuration option',
                '"offCanvas.clone"',
                '8.1.0'
            );

            //	Try to fix it.
            if (typeof this.conf.offCanvas.clone == 'undefined') {
                this.conf.offCanvas.clone = this.conf.clone;
            }
        }

        if (warnings.length) {
            _console.group('Mmenu deprecated warnings.');
            warnings.forEach(msg => {
                _console.warn(msg);
            });
            _console.groupEnd();
        }
    };
})();
