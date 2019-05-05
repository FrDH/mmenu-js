import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

export default function(this: Mmenu) {
    this.conf.classNames.selected = 'current-menu-item';

    var wpadminbar = document.getElementById('wpadminbar');
    if (wpadminbar) {
        wpadminbar.style.position = 'fixed';
        wpadminbar.classList.add('mm-slideout');
    }
}
