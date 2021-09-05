import { createTestDrawingWithAllShapes } from
'../../../helpers/createTestDrawingWithAllShapes.js';
import { drawingToLineSegments } from
'../../../../modules/drawing-menu/download/line-segments/drawingToLineSegments.js';
import { lineSegmentsToBackgroundColour } from
'../../../../modules/drawing-menu/download/line-segments/lineSegmentsToBackgroundColour.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testLineSegmentsToBackgroundColour(logger) {
	const cases = [
	{'drawing': createTestDrawingWithAllShapes(), 'out': '#FFFFFF'}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const lines = drawingToLineSegments(caseInfo.drawing, 10);
		const backgroundColour = lineSegmentsToBackgroundColour(lines);
		const backgroundStr = backgroundColour.toString();
		if (backgroundStr !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${backgroundStr}`);
	});
};