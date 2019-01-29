Mmenu.addons.searchfield = function () {
    var _this = this;
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	Extend shorthand options.
    if (typeof opts == 'boolean') {
        opts = {
            add: opts
        };
    }
    if (typeof opts != 'object') {
        opts = {};
    }
    if (typeof opts.panel == 'boolean') {
        opts.panel = {
            add: opts.panel
        };
    }
    if (typeof opts.panel != 'object') {
        opts.panel = {};
    }
    //	/Extend shorthand options.
    if (!opts.add) {
        return;
    }
    //	Extend logical options.
    if (opts.addTo == 'panel') {
        opts.panel.add = true;
    }
    if (opts.panel.add) {
        opts.showSubPanels = false;
        if (opts.panel.splash) {
            opts.cancel = true;
        }
    }
    //	/Extend logical options.
    this.opts.searchfield = Mmenu.extend(opts, Mmenu.options.searchfield);
    //	Blur searchfield
    this.bind('close:start', function () {
        Mmenu.DOM.find(_this.node.menu, '.mm-searchfield')
            .forEach(function (input) {
            input.blur();
        });
    });
    this.bind('initPanels:after', function (panels) {
        var searchpanel = null;
        //	Add the search panel
        if (opts.panel.add) {
            searchpanel = _this._initSearchPanel(panels);
        }
        //	Add the searchfield
        var addTo = null;
        switch (opts.addTo) {
            case 'panels':
                addTo = panels;
                break;
            case 'panel':
                addTo = [searchpanel];
                break;
            default:
                if (typeof opts.addTo == 'string') {
                    addTo = Mmenu.DOM.find(_this.node.menu, opts.addTo);
                }
                else if (Mmenu.typeof(opts.addTo) == 'array') {
                    addTo = opts.addTo;
                }
                break;
        }
        addTo.forEach(function (form) {
            form = _this._initSearchfield(form);
            if (opts.search && form) {
                _this._initSearching(form);
            }
        });
        //	Add the no-results message
        if (opts.noResults) {
            (opts.panel.add ? [searchpanel] : panels).forEach(function (panel) {
                _this._initNoResultsMsg(panel);
            });
        }
    });
    //	Add click behavior.
    //	Prevents default behavior when clicking an anchor
    this.clck.push(function (anchor, args) {
        if (args.inMenu) {
            if (anchor.matches('.mm-searchfield__btn')) {
                //	Clicking the clear button
                if (anchor.matches('.mm-btn_close')) {
                    var form = anchor.closest('.mm-searchfield'), input = Mmenu.DOM.find(form, 'input')[0];
                    input.value = '';
                    _this.search(input);
                    return true;
                }
                //	Clicking the submit button
                if (anchor.matches('.mm-btn_next')) {
                    var form = anchor.closest('form');
                    if (form) {
                        form.submit();
                    }
                    return true;
                }
            }
        }
    });
};
//	Default options and configuration.
Mmenu.options.searchfield = {
    add: false,
    addTo: 'panels',
    cancel: false,
    noResults: 'No results found.',
    placeholder: 'Search',
    panel: {
        add: false,
        dividers: true,
        fx: 'none',
        id: null,
        splash: null,
        title: 'Search'
    },
    search: true,
    showTextItems: false,
    showSubPanels: true
};
Mmenu.configs.searchfield = {
    clear: false,
    form: false,
    input: false,
    submit: false
};
Mmenu.prototype._initSearchPanel = function (panels) {
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	Only once
    if (Mmenu.DOM.children(this.node.pnls, '.mm-panel_search').length) {
        return null;
    }
    var searchpanel = Mmenu.DOM.create('div.mm-panel_search'), listview = Mmenu.DOM.create('ul');
    searchpanel.append(listview);
    this.node.pnls.append(searchpanel);
    if (opts.panel.id) {
        searchpanel.id = opts.panel.id;
    }
    if (opts.panel.title) {
        searchpanel.setAttribute('data-mm-title', opts.panel.title);
    }
    switch (opts.panel.fx) {
        case false:
            break;
        case 'none':
            searchpanel.classList.add('mm-panel_noanimation');
            break;
        default:
            searchpanel.classList.add('mm-panel_fx-' + opts.panel.fx);
            break;
    }
    //	Add splash content
    if (opts.panel.splash) {
        var splash = Mmenu.DOM.create('div.mm-panel__searchsplash');
        splash.innerHTML = opts.panel.splash;
        searchpanel.append(splash);
    }
    this._initPanels([searchpanel]);
    return searchpanel;
};
Mmenu.prototype._initSearchfield = function (wrapper) {
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	No searchfield in vertical submenus	
    if (wrapper.parentElement.matches('.mm-listitem_vertical')) {
        return null;
    }
    //	Only one searchfield per panel
    var form = Mmenu.DOM.find(wrapper, '.mm-searchfield')[0];
    if (form) {
        return form;
    }
    function addAttributes(element, attr) {
        if (attr) {
            for (var a in attr) {
                element.setAttribute(a, attr[a]);
            }
        }
    }
    var form = Mmenu.DOM.create((conf.form ? 'form' : 'div') + '.mm-searchfield'), field = Mmenu.DOM.create('div.mm-searchfield__input'), input = Mmenu.DOM.create('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = this.i18n(opts.placeholder);
    field.append(input);
    form.append(field);
    wrapper.prepend(form);
    if (wrapper.matches('.mm-panel')) {
        wrapper.classList.add('mm-panel_has-searchfield');
    }
    //	Add attributes to the input
    addAttributes(input, conf.input);
    //	Add the clear button
    if (conf.clear) {
        var anchor = Mmenu.DOM.create('a.mm-btn.mm-btn_close.mm-searchfield__btn');
        anchor.setAttribute('href', '#');
        field.append(anchor);
    }
    //	Add attributes and submit to the form
    addAttributes(form, conf.form);
    if (conf.form && conf.submit && !conf.clear) {
        var anchor = Mmenu.DOM.create('a.mm-btn.mm-btn_next.mm-searchfield__btn');
        anchor.setAttribute('href', '#');
        field.append(anchor);
    }
    if (opts.cancel) {
        var anchor = Mmenu.DOM.create('a.mm-searchfield__cancel');
        anchor.setAttribute('href', '#');
        anchor.innerText = this.i18n('cancel');
        form.append(anchor);
    }
    return form;
};
Mmenu.prototype._initSearching = function (form) {
    var _this = this;
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    var data = {};
    //	In the searchpanel.
    if (form.closest('.mm-panel_search')) {
        data.panels = Mmenu.DOM.find(this.node.pnls, '.mm-panel');
        data.noresults = [form.closest('.mm-panel')];
    }
    //	In a panel
    else if (form.closest('.mm-panel')) {
        data.panels = [form.closest('.mm-panel')];
        data.noresults = data.panels;
    }
    //	Not in a panel, global
    else {
        data.panels = Mmenu.DOM.find(this.node.pnls, '.mm-panel');
        data.noresults = [this.node.menu];
    }
    //	Filter out vertical submenus
    data.panels = data.panels.filter(function (panel) { return !panel.parentElement.matches('.mm-listitem_vertical'); });
    //	Filter out search panel
    data.panels = data.panels.filter(function (panel) { return !panel.matches('.mm-panel_search'); });
    var listitems = [];
    data.panels.forEach(function (panel) {
        listitems.push.apply(listitems, Mmenu.DOM.find(panel, '.mm-listitem'));
    });
    data.listitems = listitems.filter(function (listitem) { return !listitem.matches('.mm-listitem_divider'); });
    data.dividers = listitems.filter(function (listitem) { return listitem.matches('.mm-listitem_divider'); });
    input['mmSearchfield'] = data;
    var searchpanel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_search')[0], input = Mmenu.DOM.find(form, 'input')[0], cancel = Mmenu.DOM.find(form, '.mm-searchfield__cancel')[0];
    if (opts.panel.add && opts.panel.splash) {
        Mmenu.$(input)
            .off('focus.mm-searchfield-splash')
            .on('focus.mm-searchfield-splash', function (e) {
            _this.openPanel(searchpanel);
        });
    }
    if (opts.cancel) {
        Mmenu.$(input)
            .off('focus.mm-searchfield-cancel') //	TODO, is this really needed?
            .on('focus.mm-searchfield-cancel', function (e) {
            cancel.classList.add('mm-searchfield__cancel-active');
        });
        Mmenu.$(cancel)
            .off('click.mm-searchfield-splash') //	TODO, is this really needed?
            .on('click.mm-searchfield-splash', function (e) {
            e.preventDefault();
            cancel.classList.remove('mm-searchfield__cancel-active');
            if (searchpanel.matches('.mm-panel_opened')) {
                var parents = Mmenu.DOM.children(_this.node.pnls, '.mm-panel_opened-parent');
                if (parents.length) {
                    _this.openPanel(parents[parents.length - 1]);
                }
            }
        });
    }
    if (opts.panel.add && opts.addTo == 'panel') {
        this.bind('openPanel:finish', function (panel) {
            if (panel === searchpanel) {
                input.focus();
            }
        });
    }
    Mmenu.$(input)
        .off('input.mm-searchfield') // 	TOOD: is dit nodig?
        .on('input.mm-searchfield', function (evnt) {
        switch (evnt.keyCode) {
            case 9: //	tab
            case 16: //	shift
            case 17: //	control
            case 18: //	alt
            case 37: //	left
            case 38: //	top
            case 39: //	right
            case 40: //	bottom
                break;
            default:
                _this.search(input);
                break;
        }
    });
    //	Fire once initially
    //	TODO better in initMenu:after or the likes
    this.search(input);
};
Mmenu.prototype._initNoResultsMsg = function (wrapper) {
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    //	Not in a panel
    if (!wrapper.closest('.mm-panel')) {
        wrapper = Mmenu.DOM.children(this.node.pnls, '.mm-panel')[0];
    }
    //	Only once
    if (Mmenu.DOM.children(wrapper, '.mm-panel__noresultsmsg').length) {
        return;
    }
    //	Add no-results message
    var message = Mmenu.DOM.create('div.mm-panel__noresultsmsg.mm-hidden');
    message.innerHTML = this.i18n(opts.noResults);
    wrapper.prepend(message);
};
Mmenu.prototype.search = function (input, query) {
    var _this = this;
    var _a;
    var opts = this.opts.searchfield, conf = this.conf.searchfield;
    query = query || '' + input.value;
    query = query.toLowerCase().trim();
    var data = input['mmSearchfield'];
    var form = input.closest('.mm-searchfield'), buttons = Mmenu.DOM.find(form, '.mm-btn'), searchpanel = Mmenu.DOM.children(this.node.pnls, '.mm-panel_search')[0];
    var panels = data.panels, noresults = data.noresults, listitems = data.listitems, dividers = data.dividers;
    //	Reset previous results
    listitems.forEach(function (listitem) {
        listitem.classList.remove('mm-listitem_nosubitems');
    });
    //	TODO: dit klopt niet meer	
    // Mmenu.$(listitems).find( '.mm-btn_fullwidth-search' )
    // .removeClass( 'mm-btn_fullwidth-search mm-btn_fullwidth' );
    Mmenu.DOM.children(searchpanel, '.mm-listview')[0].innerHTML = '';
    panels.forEach(function (panel) {
        panel.scrollTop = 0;
    });
    //	Search
    if (query.length) {
        //	Initially hide all listitems
        listitems.forEach(function (listitem) {
            listitem.classList.add('mm-hidden');
        });
        dividers.forEach(function (divider) {
            divider.classList.add('mm-hidden');
        });
        //	Re-show only listitems that match
        listitems.forEach(function (listitem) {
            var _search = '.mm-listitem__text'; // 'a'
            if (opts.showTextItems || (opts.showSubPanels && listitem.querySelector('.mm-btn_next'))) {
                // _search = 'a, span';
            }
            else {
                _search = 'a' + _search;
            }
            if (Mmenu.DOM.children(listitem, _search)[0].innerText.toLowerCase().indexOf(query) > -1) {
                listitem.classList.remove('mm-hidden');
            }
        });
        //	Show all mached listitems in the search panel
        if (opts.panel.add) {
            //	Clone all matched listitems into the search panel
            var allitems_1 = [];
            panels.forEach(function (panel) {
                var listitems = Mmenu.filterListItems(Mmenu.DOM.find(panel, '.mm-listitem'));
                if (listitems.length) {
                    if (opts.panel.dividers) {
                        var divider = Mmenu.DOM.create('li.mm-listitem.mm-listitem_divider');
                        divider.innerHTML = panel.querySelector('.mm-navbar__title').innerHTML;
                        listitems.push(divider);
                    }
                    listitems.forEach(function (listitem) {
                        allitems_1.push(listitem.cloneNode(true));
                    });
                }
            });
            //	Remove toggles, checks and open buttons
            allitems_1.forEach(function (listitem) {
                listitem.querySelectorAll('.mm-toggle, .mm-check, .mm-btn')
                    .forEach(function (element) {
                    element.remove();
                });
            });
            //	Add to the search panel
            (_a = Mmenu.DOM.children(searchpanel, '.mm-listview')[0]).append.apply(_a, listitems);
            //	Open the search panel
            this.openPanel(searchpanel);
        }
        else {
            //	Also show listitems in sub-panels for matched listitems
            if (opts.showSubPanels) {
                panels.forEach(function (panel) {
                    var listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                    Mmenu.filterListItems(listitems)
                        .forEach(function (listitem) {
                        var child = listitem['mmChild'];
                        if (child) {
                            Mmenu.DOM.find(child, '.mm-listitem')
                                .forEach(function (listitem) {
                                listitem.classList.remove('mm-hidden');
                            });
                        }
                    });
                });
            }
            //	Update parent for sub-panel
            panels.reverse()
                .forEach(function (panel, p) {
                var parent = panel['mmParent'];
                if (parent) {
                    //	The current panel has mached listitems
                    var listitems_1 = Mmenu.DOM.find(panel, '.mm-listitem');
                    if (Mmenu.filterListItems(listitems_1).length) {
                        //	Show parent
                        if (parent.matches('.mm-hidden')) {
                            parent.classList.remove('mm-hidden');
                            //	TODO: dit klopt niet meer...
                            //	Het idee was een btn tijdelijk fullwidth te laten zijn
                            // Mmenu.$(parent)
                            // 	.children( '.mm-btn_next' )
                            // 	.not( '.mm-btn_fullwidth' )
                            // 	.addClass( 'mm-btn_fullwidth' )
                            // 	.addClass( 'mm-btn_fullwidth-search' );
                        }
                    }
                    else if (!input.closest('.mm-panel')) {
                        if (panel.matches('.mm-panel_opened') ||
                            panel.matches('.mm-panel_opened-parent')) {
                            //	Compensate the timeout for the opening animation
                            setTimeout(function () {
                                _this.openPanel(parent.closest('.mm-panel'));
                            }, (p + 1) * (_this.conf.openingInterval * 1.5));
                        }
                        parent.classList.add('mm-listitem_nosubitems');
                    }
                }
            });
            //	Show first preceeding divider of parent
            panels.forEach(function (panel) {
                var listitems = Mmenu.DOM.find(panel, '.mm-listitem');
                Mmenu.filterListItems(listitems)
                    .forEach(function (listitem) {
                    Mmenu.DOM.prevAll(listitem, '.mm-listitem_divider')[0]
                        .classList.remove('mm-hidden');
                });
            });
        }
        //	Show submit / clear button
        buttons.forEach(function (button) {
            button.classList.remove('mm-hidden');
        });
        //	Show/hide no results message
        noresults.forEach(function (wrapper) {
            Mmenu.DOM.find(wrapper, '.mm-panel__noresultsmsg')[0]
                .classList[listitems.filter(function (listitem) { return !listitem.matches('.mm-hidden'); }).length ? 'add' : 'remove']('mm-hidden');
        });
        if (opts.panel.add) {
            //	Hide splash
            if (opts.panel.splash) {
                Mmenu.DOM.find(searchpanel, '.mm-panel__searchsplash')[0]
                    .classList.add('mm-hidden');
            }
            //	Re-show original listitems when in search panel
            listitems.forEach(function (listitem) {
                listitem.classList.remove('mm-hidden');
            });
            dividers.forEach(function (divider) {
                divider.classList.remove('mm-hidden');
            });
        }
    }
    //	Don't search
    else {
        //	Show all items
        listitems.forEach(function (listitem) {
            listitem.classList.remove('mm-hidden');
        });
        dividers.forEach(function (divider) {
            divider.classList.remove('mm-hidden');
        });
        //	Hide submit / clear button
        buttons.forEach(function (button) {
            button.classList.add('mm-hidden');
        });
        //	Hide no results message
        noresults.forEach(function (wrapper) {
            Mmenu.DOM.find(wrapper, '.mm-panel__noresultsmsg')[0]
                .classList.add('mm-hidden');
        });
        if (opts.panel.add) {
            //	Show splash
            if (opts.panel.splash) {
                Mmenu.DOM.find(searchpanel, '.mm-panel__searchsplash')[0]
                    .classList.remove('mm-hidden');
            }
            //	Close panel 
            else if (!input.closest('.mm-panel_search')) {
                var opened = Mmenu.DOM.children(this.node.pnls, '.mm-panel_opened-parent');
                this.openPanel(opened.slice(-1)[0]);
            }
        }
    }
    //	Update for other addons
    this.trigger('updateListview');
};
