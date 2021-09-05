import { AngleDisplay } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/AngleDisplay.js';

export function testAngleDisplay(logger) {
	const angleDisplay = new AngleDisplay(45);
	const div = angleDisplay.toDiv();
	if (!(div instanceof Element))
		logger('toDiv() expected to be an Element but got: ' + div);
	angleDisplay.toggleUnit();
	angleDisplay.unbind();
};