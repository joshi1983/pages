import { createTestDrawing2 } from '../../../helpers/createTestDrawing2.js';
import { shapesToJSON } from '../../../../modules/drawing-menu/shape-explorer/serialization/shapesToJSON.js';
import { tryMergeShapePair } from '../../../../modules/drawing/vector/drawing_optimization/tryMergeShapePair.js';

export function testTryMergeShapePairWithTestDrawings(logger) {
	const drawing = createTestDrawing2();
	const shapes = drawing.getShapesArray();
	const originalJSON = shapesToJSON(shapes);
	for (let i = 1; i < shapes.length; i++) {
		tryMergeShapePair(shapes[i - 1], shapes[i]);
		const newJSON = shapesToJSON(shapes);
		if (originalJSON !== newJSON) {
			logger(`At index ${i}, JSON expected to be equal but it changed.  originalJSON = ${originalJSON}.  newJSON = ${newJSON}`);
			break;
		}
	}
};