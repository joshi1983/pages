import { createTestDrawing } from '../../../helpers/createTestDrawing.js';
import { optimizeDrawing } from '../../../../modules/drawing/vector/drawing_optimization/optimizeDrawing.js';

export function testOptimizeDrawing(logger) {
	const drawing = createTestDrawing();
	optimizeDrawing(drawing);
};