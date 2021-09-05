import { createDrawingFromCode } from '../helpers/createDrawingFromCode.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testDrawingsFromCode(logger) {
	const cases = [
		{'code': '', 'numShapes': 0},
		{'code': 'fd 10', 'numShapes': 1},
		{'code': 'fd 10\njumpForward 10\nforward 20', 'numShapes': 2},
		{'code': 'arcRight 10 100', 'numShapes': 1},
		{'code': 'roundRect 100 100  50', 'numShapes': 1}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const drawing = createDrawingFromCode(caseInfo.code, plogger);
		const shapes = drawing.getShapesArray();
		if (caseInfo.numShapes !== shapes.length)
			plogger(`Expected ${caseInfo.numShapes} but got ${shapes.length}`);
	});
};