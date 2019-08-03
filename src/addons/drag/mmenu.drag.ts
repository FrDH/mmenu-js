import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import DragEvents from '../../_modules/dragevents/index';
import * as DOM from '../../_modules/dom';
import * as events from '../../_modules/eventlisteners';
import * as media from '../../_modules/matchmedia';
import { extend } from '../../_modules/helpers';

//	Add the options and configs.
Mmenu.options.drag = options;

var dragInstance: DragEvents = null;

export default function(this: Mmenu) {
    if (!this.opts.offCanvas) {
        return;
    }

    var options = extendShorthandOptions(this.opts.drag);
    this.opts.drag = extend(options, Mmenu.options.drag);

    //	Drag open the menu
    if (options.menu.open) {
        this.bind('setPage:after', page => {
            dragInstance = new DragEvents(options.menu.node || page);

            /** Variables depending on the menu position */
            var positionVars = getPositionVars.call(this, {});

            var maxDistance = 0;

            var start = evnt => {
                this.node.wrpr.classList.add('mm-wrapper_dragging');

                positionVars.slideOutNodes.forEach(node => {
                    node.style['transform'] = '';
                });

                this._openSetup();
                this.trigger('open:start');

                maxDistance = this.node.menu[positionVars.menuSize];
            };

            var move = evnt => {
                var distance = evnt.detail['distance' + positionVars.axis];
                switch (positionVars.position) {
                    case 'right':
                    case 'bottom':
                        distance = Math.min(
                            Math.max(distance, -maxDistance),
                            0
                        );
                        break;

                    default:
                        distance = Math.max(Math.min(distance, maxDistance), 0);
                }

                //  Deviate for position front (the menu starts out of view).
                if (positionVars.zposition == 'front') {
                    switch (positionVars.position) {
                        case 'right':
                        case 'bottom':
                            distance += maxDistance;
                            break;

                        default:
                            distance -= maxDistance;
                            break;
                    }
                }

                positionVars.slideOutNodes.forEach(node => {
                    node.style['transform'] =
                        'translate' +
                        positionVars.axis +
                        '(' +
                        distance +
                        'px )';
                });
            };

            var stop = evnt => {
                this.node.wrpr.classList.remove('mm-wrapper_dragging');

                positionVars.slideOutNodes.forEach(node => {
                    node.style['transform'] = '';
                });

                //  TODO: bij right of bottom moet t < negatief zijn
                if (
                    evnt.detail['movement' + positionVars.axis] >= 0 ||
                    evnt.detail['distance' + positionVars.axis] >=
                        maxDistance * 0.75
                ) {
                    this._openStart();
                } else {
                    this.close();
                }
            };

            //  TODO, off heeft niet per se dezelfde axis en direction als on...
            events.off(page, 'drag' + positionVars.direction + 'Start');
            events.on(page, 'drag' + positionVars.direction + 'Start', start);

            events.off(page, 'drag' + positionVars.axis + 'Move');
            events.on(page, 'drag' + positionVars.axis + 'Move', move);

            events.off(page, 'drag' + positionVars.axis + 'End');
            events.on(page, 'drag' + positionVars.axis + 'End', stop);
        });
    }
}

function getDefaultVars(this: Mmenu, vars) {
    vars.position = 'left';
    vars.zposition = 'back';
    vars.menuSize = 'clientWidth';
    vars.axis = 'X';
    vars.direction = 'Right';
    vars.slideOutNodes = DOM.find(document.body, '.mm-slideout');

    return vars;
}

function getPositionVars(this: Mmenu, vars) {
    vars = getDefaultVars.call(this, vars);

    //  Find the values to use when the browser resizes.
    for (let query in this.opts.extensions) {
        if (this.opts.extensions[query].length) {
            let yes = () => {
                vars = getDefaultVars.call(this, vars);

                //  Find position.
                ['right', 'top', 'bottom'].forEach(pos => {
                    if (
                        this.opts.extensions[query].includes('position-' + pos)
                    ) {
                        vars.position = pos;
                    }
                });

                //  Find z-position.
                ['front', 'top', 'bottom'].forEach(pos => {
                    if (
                        this.opts.extensions[query].includes('position-' + pos)
                    ) {
                        vars.zposition = 'front';
                    }
                });

                //  Set the area where the dragging can start.
                dragInstance.area = {
                    top: vars.position == 'bottom' ? '75%' : 0,
                    right: vars.position == 'left' ? '75%' : 0,
                    bottom: vars.position == 'top' ? '75%' : 0,
                    left: vars.position == 'right' ? '75%' : 0
                };

                //  - What side of the menu to measure (width or height).
                //  - What axis to position the menu along (x or y).
                switch (vars.position) {
                    case 'top':
                    case 'bottom':
                        vars.menuSize = 'clientHeight';
                        vars.axis = 'Y';
                        break;
                }

                //  What direction to drag in.
                switch (vars.position) {
                    case 'top':
                        vars.direction = 'Down';
                        break;

                    case 'right':
                        vars.direction = 'Left';
                        break;

                    case 'bottom':
                        vars.direction = 'Up';
                        break;
                }

                //  What nodes to slide out while dragging.
                switch (vars.zposition) {
                    case 'front':
                        vars.slideOutNodes = [this.node.menu];
                        break;
                }
            };

            let mqlist = window.matchMedia(query);
            if (mqlist.matches) {
                yes();
            }

            media.add(query, yes, () => {});
        }
    }

    return vars;
}
