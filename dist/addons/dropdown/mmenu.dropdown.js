Mmenu.addons.dropdown = function () {
    var _this = this;
    if (!this.opts.offCanvas) {
        return;
    }
    var opts = this.opts.dropdown, conf = this.conf.dropdown;
    //	Extend shorthand options
    if (typeof opts == 'boolean' && opts) {
        opts = {
            drop: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (typeof opts.position == 'string') {
        opts.position = {
            of: opts.position
        };
    }
    //	/Extend shorthand options
    this.opts.dropdown = Mmenu.extend(opts, Mmenu.options.dropdown);
    if (!opts.drop) {
        return;
    }
    var button;
    this.bind('initMenu:after', function () {
        _this.node.menu.classList.add('mm-menu_dropdown');
        if (typeof opts.position.of != 'string') {
            var id = _this.vars.orgMenuId;
            if (id && id.length) {
                opts.position.of = '[href="#' + id + '"]';
            }
        }
        if (typeof opts.position.of != 'string') {
            return;
        }
        //	Get the button to put the menu next to
        button = Mmenu.DOM.find(document.body, opts.position.of)[0];
        //	Emulate hover effect
        var events = opts.event.split(' ');
        if (events.length == 1) {
            events[1] = events[0];
        }
        if (events[0] == 'hover') {
            button.addEventListener('mouseenter', function (evnt) {
                _this.open();
            }, { passive: true });
        }
        if (events[1] == 'hover') {
            _this.node.menu.addEventListener('mouseleave', function (evnt) {
                _this.close();
            }, { passive: true });
        }
    });
    //	Add/remove classname and style when opening/closing the menu
    this.bind('open:start', function () {
        _this.node.menu['mmStyle'] = _this.node.menu.getAttribute('style');
        document.documentElement.classList.add('mm-wrapper_dropdown');
    });
    this.bind('close:finish', function () {
        _this.node.menu.setAttribute('style', _this.node.menu['mmStyle']);
        document.documentElement.classList.remove('mm-wrapper_dropdown');
    });
    //	Update the position and sizes
    var getPosition = function (dir, obj) {
        var css = obj[0], cls = obj[1];
        var _scrollPos = dir == 'x' ? 'scrollLeft' : 'scrollTop', _outerSize = dir == 'x' ? 'offsetWidth' : 'offsetHeight', _startPos = dir == 'x' ? 'left' : 'top', _stopPos = dir == 'x' ? 'right' : 'bottom', _size = dir == 'x' ? 'width' : 'height', _winSize = dir == 'x' ? 'innerWidth' : 'innerHeight', _maxSize = dir == 'x' ? 'maxWidth' : 'maxHeight', _position = null;
        var scrollPos = document.documentElement[_scrollPos] || document.body[_scrollPos], startPos = Mmenu.DOM.offset(button, _startPos) - scrollPos, stopPos = startPos + button[_outerSize], windowSize = window[_winSize];
        var offs = conf.offset.button[dir] + conf.offset.viewport[dir];
        //	Position set in option
        if (opts.position[dir]) {
            switch (opts.position[dir]) {
                case 'left':
                case 'bottom':
                    _position = 'after';
                    break;
                case 'right':
                case 'top':
                    _position = 'before';
                    break;
            }
        }
        //	Position not set in option, find most space
        if (_position === null) {
            _position = (startPos + ((stopPos - startPos) / 2) < windowSize / 2) ? 'after' : 'before';
        }
        //	Set position and max
        var val, max;
        if (_position == 'after') {
            val = (dir == 'x') ? startPos : stopPos;
            max = windowSize - (val + offs);
            css[_startPos] = val + conf.offset.button[dir];
            css[_stopPos] = 'auto';
            if (opts.tip) {
                cls.push('mm-menu_tip-' + (dir == 'x' ? 'left' : 'top'));
            }
        }
        else {
            val = (dir == 'x') ? stopPos : startPos;
            max = val - offs;
            css[_stopPos] = 'calc( 100% - ' + (val - conf.offset.button[dir]) + 'px )';
            css[_startPos] = 'auto';
            if (opts.tip) {
                cls.push('mm-menu_tip-' + (dir == 'x' ? 'right' : 'bottom'));
            }
        }
        if (opts.fitViewport) {
            css[_maxSize] = Math.min(conf[_size].max, max);
        }
        return [css, cls];
    };
    function position() {
        var _a;
        if (!this.vars.opened) {
            return;
        }
        this.node.menu.setAttribute('style', this.node.menu['mmStyle']);
        var obj = [{}, []];
        obj = getPosition.call(this, 'y', obj);
        obj = getPosition.call(this, 'x', obj);
        for (var s in obj[0]) {
            this.node.menu[s] = obj[0][s];
        }
        if (opts.tip) {
            this.node.menu.classList.remove('mm-menu_tip-left', 'mm-menu_tip-right', 'mm-menu_tip-top', 'mm-menu_tip-bottom');
            (_a = this.node.menu.classList).add.apply(_a, obj[1]);
        }
    }
    ;
    this.bind('open:start', position);
    window.addEventListener('resize', function (evnt) {
        position.call(_this);
    }, { passive: true });
    if (!this.opts.offCanvas.blockUI) {
        window.addEventListener('scroll', function (evnt) {
            position.call(_this);
        }, { passive: true });
    }
};
//	Default options and configuration.
Mmenu.options.dropdown = {
    drop: false,
    fitViewport: true,
    event: 'click',
    position: {},
    tip: true
};
Mmenu.configs.dropdown = {
    offset: {
        button: {
            x: -5,
            y: 5
        },
        viewport: {
            x: 20,
            y: 20
        }
    },
    height: {
        max: 880
    },
    width: {
        max: 440
    }
};
