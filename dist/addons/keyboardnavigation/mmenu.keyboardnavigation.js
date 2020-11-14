import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';
import * as events from '../../_modules/eventlisteners';
import * as support from '../../_modules/support';
//  Add the options.
Mmenu.options.keyboardNavigation = options;
export default function () {
    //	Keyboard navigation on touchscreens opens the virtual keyboard :/
    //	Lets prevent that.
    if (support.touch) {
        return;
    }
    return;
    //	Enable keyboard navigation
    let menuStart = DOM.create('button.mm-tabstart.mm-sronly'), menuEnd = DOM.create('button.mm-tabend.mm-sronly'), blockerEnd = DOM.create('button.mm-tabend.mm-sronly');
    this.bind('initMenu:after', () => {
        if (options.enhance) {
            this.node.menu.classList.add('mm-menu--keyboardfocus');
        }
        initWindow.call(this, options.enhance);
    });
    this.bind('initOpened:before', () => {
        this.node.menu.prepend(menuStart);
        this.node.menu.append(menuEnd);
        DOM.children(this.node.menu, '.mm-navbars-top, .mm-navbars-bottom').forEach((navbars) => {
            navbars
                .querySelectorAll('.mm-navbar__title')
                .forEach((title) => {
                title.setAttribute('tabindex', '-1');
            });
        });
    });
    this.bind('initBlocker:after', () => {
        Mmenu.node.blck.append(blockerEnd);
        DOM.children(Mmenu.node.blck, 'a')[0].classList.add('');
    });
    const setFocus = () => {
        var _a;
        (_a = DOM.children(this.node.menu, '.mm-tabstart')[0]) === null || _a === void 0 ? void 0 : _a.focus();
    };
    this.bind('open:after', setFocus);
    this.bind('openPanel:after', setFocus);
    //	Add screenreader / aria support.
    this.bind('initOpened:after', () => {
        [this.node.menu, Mmenu.node.blck].forEach((element) => {
            DOM.children(element, '.mm-tabstart, .mm-tabend').forEach((tabber) => {
                sr.aria(tabber, 'hidden', true);
                sr.role(tabber, 'presentation');
            });
        });
    });
}
/**
 * Initialize the window for keyboard navigation.
 * @param {boolean} enhance - Whether or not to also rich enhance the keyboard behavior.
 **/
const initWindow = function (enhance) {
    //	Intersept the target when tabbing.
    events.off(document.body, 'focusin.tabguard');
    events.on(document.body, 'focusin.tabguard', (evnt) => {
        if (this.node.wrpr.matches('.mm-wrapper--opened')) {
            let target = evnt.target;
            if (target.matches('.mm-tabend')) {
                let next;
                //	Jump from menu to blocker.
                if (target.parentElement.matches('.mm-menu')) {
                    if (Mmenu.node.blck) {
                        next = Mmenu.node.blck;
                    }
                }
                //	Jump to opened menu.
                if (target.parentElement.matches('.mm-wrapper__blocker')) {
                    next = DOM.find(document.body, '.mm-menu--offcanvas.mm-menu--opened')[0];
                }
                //	If no available element found, stay in current element.
                if (!next) {
                    next = target.parentElement;
                }
                if (next) {
                    DOM.children(next, '.mm-tabstart')[0].focus();
                }
            }
        }
    });
    //	Add Additional keyboard behavior.
    events.on(document.body, 'keydown.navigate', (evnt) => {
        var target = evnt.target;
        var menu = target.closest('.mm-menu');
        if (menu) {
            if (!target.matches('input, textarea')) {
                switch (evnt.keyCode) {
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
            if (enhance) {
                let api = menu['mmApi'];
                switch (evnt.keyCode) {
                    //	close submenu with backspace
                    case 8:
                        let parent = DOM.find(menu, '.mm-panel--opened')[0];
                        if (parent) {
                            parent = DOM.find(menu, `#${parent.dataset.mmParent}`)[0];
                        }
                        if (parent) {
                            api.openPanel(parent.closest('.mm-panel'));
                        }
                        break;
                    //	close menu with esc
                    case 27:
                        if (menu.matches('.mm-menu--offcanvas')) {
                            api.close();
                        }
                        break;
                }
            }
        }
    });
};
