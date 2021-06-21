import { uniqueId } from '../../_modules/helpers';
export default function (navbar) {
    navbar.id = navbar.id || uniqueId();
    this.opts.searchfield = this.opts.searchfield || {};
    this.opts.searchfield.add = true;
    this.opts.searchfield.addTo = `#${navbar.id}`;
}
