import Mmenu from '../../core/oncanvas/mmenu.oncanvas';

export default function(
	this : Mmenu
) {
	this.opts.onClick = {
		close			: true,
		preventDefault	: false,
		setSelected		: true
	};
};