import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import DragEngine from '../../_modules/drag';
import { extend } from '../../_modules/helpers';

//	Add the options and configs.
Mmenu.options.drag = options;

export default function(this: Mmenu) {
    if (!this.opts.offCanvas) {
        return;
    }

    var options = extendShorthandOptions(this.opts.drag);
    this.opts.drag = extend(options, Mmenu.options.drag);

    //	Drag open the menu
    if (options.menu.open) {
        this.bind('setPage:after', page => {
            new DragEngine(options.menu.node || page, {
                top: 0,
                right: '75%',
                bottom: 0,
                left: 0
            });

            //  TODO: position-right / top / bottom / front?

            var maxDistance = 0;
            var slideOutNodes = DOM.find(document.body, '.mm-slideout');

            var start = evnt => {
                this.node.wrpr.classList.add('mm-wrapper_dragging');

                slideOutNodes.forEach(node => {
                    node.style['transform'] = '';
                });

                this._openSetup();
                this.trigger('open:start');

                maxDistance = this.node.menu.clientWidth;
            };

            var move = evnt => {
                var distance = Math.max(
                    Math.min(evnt.detail.distanceX, maxDistance),
                    0
                );
                slideOutNodes.forEach(node => {
                    node.style['transform'] = 'translateX(' + distance + 'px )';
                });
            };

            var stop = evnt => {
                this.node.wrpr.classList.remove('mm-wrapper_dragging');

                slideOutNodes.forEach(node => {
                    node.style['transform'] = '';
                });

                // na 75% altijd openen?
                this[evnt.detail.movementX > 0 ? '_openStart' : 'close']();
            };

            page.addEventListener('dragRightStart', start);
            page.addEventListener('dragX', move);
            page.addEventListener('dragXEnd', stop);
        });
    }
}
