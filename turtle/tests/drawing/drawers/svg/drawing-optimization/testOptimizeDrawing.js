import { createTestDrawing } from '../../../../helpers/createTestDrawing.js';
import { createTestDrawing2 } from '../../../../helpers/createTestDrawing2.js';
import { createTestDrawingWithCustomEasing } from '../../../../helpers/createTestDrawingWithCustomEasing.js';
import { createTestPostScriptDrawing } from '../../../../helpers/createTestPostScriptDrawing.js';
import { optimizeDrawing } from '../../../../../modules/drawing/drawers/svg/drawing-optimization/optimizeDrawing.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { VectorDrawing } from '../../../../../modules/drawing/vector/VectorDrawing.js';

function testWithVariousDrawings(logger) {
	const drawings = [
		createTestDrawing(),
		createTestDrawing2(),
		createTestDrawingWithCustomEasing(),
		createTestPostScriptDrawing()
	];
	drawings.forEach(function(drawing, index) {
		const result = optimizeDrawing(drawing);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (!(result instanceof VectorDrawing))
			plogger(`Expected a VectorDrawing but got ${result}`);
	});
}

export function testOptimizeDrawing(logger) {
	testWithVariousDrawings(prefixWrapper('testWithVariousDrawings', logger));
};