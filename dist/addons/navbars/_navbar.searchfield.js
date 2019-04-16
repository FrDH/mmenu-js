<<<<<<< HEAD
!function(e){e.mmenu.addons.navbars.searchfield=function(s,t){e.mmenu._c;"object"!=typeof this.opts.searchfield&&(this.opts.searchfield={}),this.opts.searchfield.add=!0,this.opts.searchfield.addTo=s}}(jQuery);
=======
import { type } from '../../core/_helpers';
export default function (navbar) {
    if (type(this.opts.searchfield) != 'object') {
        this.opts.searchfield = {};
    }
    this.opts.searchfield.add = true;
    this.opts.searchfield.addTo = [navbar];
}
;
>>>>>>> develop
