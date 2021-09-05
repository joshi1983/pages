import { ObjectDisplay } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/ObjectDisplay.js';

export function testObjectDisplay(logger) {
	const display = new ObjectDisplay({}, '', '');
	const div = display.toDiv();
	if (!(div instanceof Element)) {
		logger('Expected an Element but got ' + div);
	}
	display.setExpanded(true);
	display.setExpanded(false);
	display.unbind();
};