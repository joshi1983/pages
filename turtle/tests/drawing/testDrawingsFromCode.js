import { createDrawingFromCode } from '../helpers/createDrawingFromCode.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testDrawingsFromCode(logger) {
	const cases = [
		{'code': '', 'numShapes': 0},
		{'code': 'fd 10', 'numShapes': 1},
		{'code': 'fd 10\njumpForward 10\nforward 20', 'numShapes': 2},
		{'code': 'arcRight 10 100', 'numShapes': 1},
		{'code': 'roundRect 100 100  50', 'numShapes': 1},
		{'code': 'stripes 10 20 ["red]', 'numShapes': 1},
		{'code': 'rect 100 200', 'numShapes': 1},
		{'code': 'circle 20', 'numShapes': 1},
		{'code': 'ellipse 10 20', 'numShapes': 1},
		{'code': `left 90
forward 51
arcLeft 50 20

jumpTo [0 0]
setHeading -60	
forward 51
arcLeft 90 20`, 'numShapes': 1},

		{'code': `repeat 2 [
	stripes 100 1 ["black]
	right 90
]`, 'numShapes': 2},
// We don't want the line segments joined into a single path 
// because the path would fill a square that we don't want.

		{'code': `repeat 2 [
	stripes 100 1 ["black]
	jumpForward 1
]`, 'numShapes': 1}, // the 2 line segments should merge into 1 because it 
// simplifies the drawing without any undesirable visual changes.

		{'code': `right 30
	repeat 2 [
	stripes 100 1 ["black]
	jumpForward 1
]`, 'numShapes': 1}, // same as before but rotated should still merge into 1 line segment

	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const drawing = createDrawingFromCode(caseInfo.code, plogger);
		const shapes = drawing.getShapesArray();
		if (caseInfo.numShapes !== shapes.length)
			plogger(`Expected ${caseInfo.numShapes} but got ${shapes.length}`);
	});
};