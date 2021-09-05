import { Colour } from '../../../../modules/Colour.js';
import { colourToElement } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/colourToElement.js';

export function testColourToElement(logger) {
	const colours = [
		new Colour('#000'),
		new Colour('#fff')
	];
	colours.forEach(function(colour) {
		const result = colourToElement(colour);
		if (!(result instanceof Element))
			logger('Expected an Element but got ' + result);
	});
};