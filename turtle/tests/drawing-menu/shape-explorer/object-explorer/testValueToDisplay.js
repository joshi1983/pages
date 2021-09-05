import { Colour } from '../../../../modules/Colour.js';
import { valueToDisplay } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/valueToDisplay.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testValueToDisplay(logger) {
	const cases = [
		new Colour('red'),
		[1, 2, 3],
		"Hello world",
		4,
		new Vector3D(1, 2, 3),
		{
			"val1": 234,
			"val2": [],
			"val3": [1, 2, 3],
			"val4": new Colour("black"),
			"rotation": 5
		},
		true,
		false
	];
	cases.forEach(function(caseInfo, index) {
		const display = valueToDisplay(caseInfo, '');
		const div = display.toDiv();
		if (!(div instanceof Element))
			logger(`Case ${index}.  div must be an Element.  Not: ${div}`);
	});
};