import { ColouredLineSegment } from
'../../../../modules/drawing-menu/download/line-segments/ColouredLineSegment.js';
import { createTestDrawingWith3DPointCloud } from
'../../../helpers/createTestDrawingWith3DPointCloud.js';
import { createTestDrawingWithAllShapes } from
'../../../helpers/createTestDrawingWithAllShapes.js';
import { drawingToLineSegments } from
'../../../../modules/drawing-menu/download/line-segments/drawingToLineSegments.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testDrawingToLineSegments(logger) {
	const cases = [
	{'drawing': createTestDrawingWith3DPointCloud()},
	{'drawing': createTestDrawingWithAllShapes()}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = drawingToLineSegments(caseInfo.drawing, 10);
		if (!(result instanceof Array))
			plogger(`Expected an Array but got ${result}`);
		else {
			result.forEach(function(line, lineIndex) {
				if (!(line instanceof ColouredLineSegment))
					plogger(`Expected every element to be a ColouredLineSegment but got ${line} at line index ${lineIndex}`);
			});
		}
	});
};