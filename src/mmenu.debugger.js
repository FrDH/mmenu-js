/**
 * Debugger for mmenu.js
 * Include this file after including the mmenu.js plugin to debug your menu.
 */
(function() {
    const _console = Mmenu.console ||
        console || {
            log: function() {},
            warn: function() {},
            error: function() {},
            group: function() {},
            groupEnd: function() {}
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
    Mmenu.prototype._deprecatedWarnings = function() {
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

        // Removed the tileview extension.
        ['tileview'].forEach(ext => {
            Object.keys(this.opts.extensions).forEach(key => {
                if (this.opts.extensions[key].includes(ext)) {
                    deprecated(
                        'The "' + ext + '" extension',
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
                    'The "drag.menu" options for the "drag" add-on',
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
                    'Using the classname ' + ext + ' on a specific panel.',
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
                        'The "' + ext + '" extension',
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
            this.bind(method + ':before', panel => {
                if (
                    typeof panel != 'undefined' &&
                    typeof jQuery != 'undefined' &&
                    panel instanceof jQuery
                ) {
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
            this.bind(method + ':before', panel => {
                if (
                    typeof panel != 'undefined' &&
                    typeof jQuery != 'undefined' &&
                    panel instanceof jQuery
                ) {
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
                    '"use"',
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
                '"fixed.insertMethod"',
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
                '"fixed.insertSelector"',
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

        /* WRAPPERS */

        //	Removed and renamed framework wrappers
        if (this.opts.wrappers) {
            this.opts.wrappers.forEach(wrapper => {
                switch (wrapper) {
                    //  Bootstrap 3 framework wrapper is removed
                    case 'bootstrap3':
                        deprecated('The "bootstrap3" wrapper', null, '8.0.0');

                        //  Try to fix it.
                        let indexbs3 = this.opts.wrappers.indexOf(wrapper);
                        if (indexbs3 > -1) {
                            this.opts.wrappers.splice(indexbs3, 1);
                        }
                        break;

                    //  Bootstrap 4 framework wrapper is renamed to "bootstrap"
                    case 'bootstrap4':
                        deprecated(
                            'The "bootstrap4" wrapper',
                            '"bootstrap"',
                            '8.0.0'
                        );

                        //	Try to fix it.
                        this.opts.wrappers.push('bootstrap');

                        let indexbs4 = this.opts.wrappers.indexOf(wrapper);
                        if (indexbs4 > -1) {
                            this.opts.wrappers.splice(indexbs4, 1);
                        }
                        break;

                    //  jQuery Mobile framework wrapper is removed
                    case 'jqueryMobile':
                        deprecated('The "jqueryMobile" wrapper', null, '8.0.0');

                        //  Try to fix it.
                        let indexjqm = this.opts.wrappers.indexOf(wrapper);
                        if (indexjqm > -1) {
                            this.opts.wrappers.splice(indexjqm, 1);
                        }
                        break;
                }
            });
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
