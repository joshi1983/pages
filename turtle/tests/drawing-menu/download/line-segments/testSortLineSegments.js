import { createTestDrawingWithAllShapes } from '../../../helpers/createTestDrawingWithAllShapes.js';
import { drawingToLineSegments } from
'../../../../modules/drawing-menu/download/line-segments/drawingToLineSegments.js';
import { sortLineSegments } from '../../../../modules/drawing-menu/download/line-segments/sortLineSegments.js';

export function testSortLineSegments(logger) {
	const drawing = createTestDrawingWithAllShapes();
	const lines = drawingToLineSegments(drawing, 10);
	sortLineSegments(lines);
};