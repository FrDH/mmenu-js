import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

export default function(this: Mmenu) {
    let classnames;

    document.addEventListener('turbolinks:before-visit', evnt => {
        classnames = document
            .querySelector('.mm-wrapper')
            .className.split(' ')
            .filter(name => /mm-/.test(name));
    });

    document.addEventListener('turbolinks:load', evnt => {
        if (typeof classnames === 'undefined') {
            return;
        }

        document.querySelector('.mm-wrapper').className = classnames;
    });
}
