Mmenu.addons.keyboardNavigation = function () {
    var _this = this;
    //	Keyboard navigation on touchscreens opens the virtual keyboard :/
    //	Lets prevent that.
    if (Mmenu.support.touch) {
        return;
    }
    var opts = this.opts.keyboardNavigation;
    //	Extend shorthand options
    if (typeof opts == 'boolean' || typeof opts == 'string') {
        opts = {
            enable: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    //	/Extend shorthand options
    this.opts.keyboardNavigation = Mmenu.extend(opts, Mmenu.options.keyboardNavigation);
    //	Enable keyboard navigation
    if (opts.enable) {
        var menuStart_1 = Mmenu.DOM.create('button.mm-tabstart'), menuEnd_1 = Mmenu.DOM.create('button.mm-tabend'), blockerEnd_1 = Mmenu.DOM.create('button.mm-tabend');
        this.bind('initMenu:after', function () {
            if (opts.enhance) {
                _this.node.menu.classList.add('mm-menu_keyboardfocus');
            }
            _this._initWindow_keyboardNavigation(opts.enhance);
        });
        this.bind('initOpened:before', function () {
            _this.node.menu.prepend(menuStart_1);
            _this.node.menu.append(menuEnd_1);
            Mmenu.DOM.children(_this.node.menu, '.mm-navbars-top, .mm-navbars-bottom')
                .forEach(function (navbars) {
                navbars.querySelectorAll('.mm-navbar__title')
                    .forEach(function (title) {
                    title.setAttribute('tabindex', '-1');
                });
            });
        });
        this.bind('initBlocker:after', function () {
            Mmenu.node.blck.append(blockerEnd_1);
            Mmenu.DOM.children(Mmenu.node.blck, 'a')[0]
                .classList.add('mm-tabstart');
        });
        var focusable = 'input, select, textarea, button, label, a[href]';
        function setFocus(panel) {
            panel = panel || Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened')[0];
            var focus = null;
            //	Focus already is on an element in a navbar in this menu.
            var navbar = document.activeElement.closest('.mm-navbar');
            if (navbar) {
                if (navbar.closest('.mm-menu') == this.node.menu) {
                    return;
                }
            }
            //	Set the focus to the first focusable element by default.
            if (opts.enable == 'default') {
                //	First visible anchor in a listview in the current panel.
                focus = Mmenu.DOM.find(panel, '.mm-listview a[href]:not(.mm-hidden)')[0];
                //	First focusable and visible element in the current panel.
                if (!focus) {
                    focus = Mmenu.DOM.find(panel, focusable + ':not(.mm-hidden)')[0];
                }
                //	First focusable and visible element in a navbar.
                if (!focus) {
                    var elements_1 = [];
                    Mmenu.DOM.children(this.node.menu, '.mm-navbars_top, .mm-navbars_bottom')
                        .forEach(function (navbar) {
                        elements_1.push.apply(elements_1, Mmenu.DOM.find(navbar, focusable + ':not(.mm-hidden)'));
                    });
                    focus = elements_1[0];
                }
            }
            //	Default.
            if (!focus) {
                focus = Mmenu.DOM.children(this.node.menu, '.mm-tabstart')[0];
            }
            if (focus) {
                focus.focus();
            }
        }
        this.bind('open:finish', setFocus);
        this.bind('openPanel:finish', setFocus);
        //	Add screenreader / aria support.
        this.bind('initOpened:after:sr-aria', function () {
            [_this.node.menu, Mmenu.node.blck].forEach(function (element) {
                Mmenu.DOM.children(element, '.mm-tabstart, .mm-tabend')
                    .forEach(function (tabber) {
                    Mmenu.sr_aria(tabber, 'hidden', true);
                    Mmenu.sr_role(tabber, 'presentation');
                });
            });
        });
    }
};
//	Default options and configuration.
Mmenu.options.keyboardNavigation = {
    enable: false,
    enhance: false
};
/**
 * Initialize the window.
 * @param {boolean} enhance - Whether or not to also rich enhance the keyboard behavior.
 **/
Mmenu.prototype._initWindow_keyboardNavigation = function (enhance) {
    Mmenu.$(window)
        //	Re-enable tabbing in general
        //	TODO: dit wordt lastig omdat removeEventListner de functie als argument nodig heeft
        .off('keydown.mm-offCanvas')
        //	Prevent tabbing outside an offcanvas menu
        .off('focusin.mm-keyboardNavigation')
        .on('focusin.mm-keyboardNavigation', function (evnt) {
        if (document.documentElement.matches('.mm-wrapper_opened')) {
            var target = evnt.target; // Typecast to any because somehow, TypeScript thinks event.target is the window.
            if (target.matches('.mm-tabend')) {
                var next = void 0;
                //	Jump from menu to blocker.
                if (target.parentElement.matches('.mm-menu')) {
                    if (Mmenu.node.blck) {
                        next = Mmenu.node.blck;
                    }
                }
                //	Jump to opened menu.
                if (target.parentElement.matches('.mm-wrapper__blocker')) {
                    next = Mmenu.DOM.find(document.body, '.mm-menu_offcanvas.mm-menu_opened')[0];
                }
                //	If no available element found, stay in current element.
                if (!next) {
                    next = target.parentElement;
                }
                if (next) {
                    Mmenu.DOM.children(next, '.mm-tabstart')[0].focus();
                }
            }
        }
    })
        //	Default keyboard navigation
        .off('keydown.mm-keyboardNavigation')
        .on('keydown.mm-keyboardNavigation', function (evnt) {
        var target = evnt.target;
        var menu = target.closest('.mm-menu');
        if (menu) {
            var api = menu['mmenu'];
            //	special case for input and textarea
            if (target.matches('input, textarea')) {
            }
            else {
                switch (evnt.keyCode) {
                    //	press enter to toggle and check
                    case 13:
                        if (target.matches('.mm-toggle') ||
                            target.matches('.mm-check')) {
                            target.dispatchEvent(new Event('click'));
                        }
                        break;
                    //	prevent spacebar or arrows from scrolling the page
                    case 32: //	space
                    case 37: //	left
                    case 38: //	top
                    case 39: //	right
                    case 40: //	bottom
                        evnt.preventDefault();
                        break;
                }
            }
        }
    });
    if (enhance) {
        Mmenu.$(window)
            //	Enhanced keyboard navigation
            .off('keydown.mm-keyboardNavigation')
            .on('keydown.mm-keyboardNavigation', function (evnt) {
            var target = evnt.target; // Typecast to any because somehow, TypeScript thinks event.target is the window.
            var menu = target.closest('.mm-menu');
            if (menu) {
                var api = menu['mmenu'];
                //	special case for input and textarea
                if (target.matches('input')) {
                    switch (evnt.keyCode) {
                        //	empty searchfield with esc
                        case 27:
                            target.value = '';
                            break;
                    }
                }
                else {
                    switch (evnt.keyCode) {
                        //	close submenu with backspace
                        case 8:
                            var parent = Mmenu.DOM.find(menu, '.mm-panel_opened')[0]['mmParent'];
                            if (parent) {
                                api.openPanel(parent.closest('.mm-panel'));
                            }
                            break;
                        //	close menu with esc
                        case 27:
                            if (menu.matches('.mm-menu_offcanvas')) {
                                api.close();
                            }
                            break;
                    }
                }
            }
        });
    }
};
