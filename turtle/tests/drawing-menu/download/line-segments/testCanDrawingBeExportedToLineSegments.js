import { createTestDrawing } from
'../../../helpers/createTestDrawing.js';
import { createTestDrawing2 } from
'../../../helpers/createTestDrawing2.js';
import { createTestDrawingWithCustomEasing } from
'../../../helpers/createTestDrawingWithCustomEasing.js';
import { createTestDrawingWithAllShapes } from
'../../../helpers/createTestDrawingWithAllShapes.js';
import { canDrawingBeExportedToLineSegments } from
'../../../../modules/drawing-menu/download/line-segments/canDrawingBeExportedToLineSegments.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testCanDrawingBeExportedToLineSegments(logger) {
	const cases = [
		{'in': createTestDrawing(), 'out': false},
		{'in': createTestDrawing2(), 'out': false},
		{'in': createTestDrawingWithCustomEasing(), 'out': false},
		{'in': createTestDrawingWithAllShapes(), 'out': true}
	];
	testInOutPairs(cases, canDrawingBeExportedToLineSegments, logger);
};