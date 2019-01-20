Mmenu.addons.navbars = function () {
    var _this = this;
    var navs = this.opts.navbars;
    if (typeof navs == 'undefined') {
        return;
    }
    if (!(navs instanceof Array)) {
        navs = [navs];
    }
    var sizes = {}, navbars = {};
    if (!navs.length) {
        return;
    }
    navs.forEach(function (opts) {
        //	Extend shorthand options.
        if (typeof opts == 'boolean' && opts) {
            opts = {};
        }
        if (typeof opts != 'object') {
            opts = {};
        }
        if (typeof opts.content == 'undefined') {
            opts.content = ['prev', 'title'];
        }
        if (!(opts.content instanceof Array)) {
            opts.content = [opts.content];
        }
        //	/Extend shorthand options.
        //	Create the navbar element.
        var navbar = Mmenu.DOM.create('div.mm-navbar');
        //	Get the height for the navbar.
        var height = opts.height;
        if (typeof height != 'number') {
            //	Defaults to a height of 1.
            height = 1;
        }
        else {
            //	Restrict the height between 1 to 4.
            height = Math.min(4, Math.max(1, height));
            if (height > 1) {
                //	Add the height class to the navbar.
                navbar.classList.add('mm-navbar_size-' + height);
            }
        }
        //	Get the position for the navbar.
        var position = opts.position;
        //	Restrict the position to either "bottom" or "top" (default).
        if (position !== 'bottom') {
            position = 'top';
        }
        //	Add up the wrapper height for the navbar position.
        if (!sizes[position]) {
            sizes[position] = 0;
        }
        sizes[position] += height;
        //	Create the wrapper for the navbar position.
        if (!navbars[position]) {
            navbars[position] = Mmenu.DOM.create('div.mm-navbars_' + position);
        }
        navbars[position].append(navbar);
        //	Add content to the navbar.
        for (var c = 0, l = opts.content.length; c < l; c++) {
            var ctnt = opts.content[c];
            //	The content is a string.
            if (typeof ctnt == 'string') {
                //	The content refers to one of the navbar-presets ("prev", "title", etc).
                var func = Mmenu.addons.navbars[ctnt];
                if (typeof func == 'function') {
                    //	Call the preset function.
                    func.call(_this, navbar);
                }
                //	The content is just HTML.
                else {
                    //	Add the HTML.
                    navbar.innerHTML += ctnt;
                }
            }
            //	The content is not a string, it must be an element.
            else {
                navbar.append(ctnt);
            }
        }
        //	If buttons were added, tell the navbar.
        if (navbar.querySelector('.mm-navbar__btn')) {
            navbar.classList.add('mm-navbar_has-btns');
        }
        //	The type option is set.
        if (typeof opts.type == 'string') {
            //	The function refers to one of the navbar-presets ("tabs").
            var func = Mmenu.addons.navbars[opts.type];
            if (typeof func == 'function') {
                //	Call the preset function.
                func.call(_this, navbar);
            }
        }
    });
    //	Add to menu
    this.bind('initMenu:after', function () {
        for (var position in navbars) {
            _this.node.menu.classList.add('mm-menu_navbar_' + position + '-' + sizes[position]);
            _this.node.menu[position == 'bottom' ? 'append' : 'prepend'](navbars[position]);
        }
    });
};
//	Default options and configuration.
Mmenu.options.navbars = [];
Mmenu.configs.navbars = {
    breadcrumbs: {
        separator: '/',
        removeFirst: false
    }
};
Mmenu.configs.classNames.navbars = {};
