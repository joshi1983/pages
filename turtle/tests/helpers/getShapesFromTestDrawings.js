import { ArrayUtils } from '../../modules/ArrayUtils.js';
import { createTestDrawing } from './createTestDrawing.js';
import { createTestDrawing2 } from './createTestDrawing2.js';
import { createTestDrawingFromDimensions } from './createTestDrawingFromDimensions.js';
import { createTestDrawingWith3DPointCloud } from './createTestDrawingWith3DPointCloud.js';
import { createTestDrawingWithCustomEasing } from './createTestDrawingWithCustomEasing.js';
import { createTestPostScriptDrawing } from './createTestPostScriptDrawing.js';
import { createTestPDFDrawing } from './createTestPDFDrawing.js';

export function getShapesFromTestDrawings() {
	const result = [];
	const drawings = [
		createTestDrawing(),
		createTestDrawing2(),
		createTestDrawingFromDimensions(100, 200),
		createTestDrawingWith3DPointCloud(),
		createTestDrawingWithCustomEasing(),
		createTestPDFDrawing(),
		createTestPostScriptDrawing()
	];
	drawings.forEach(function(drawing) {
		const shapes = drawing.getShapesArray();
		ArrayUtils.pushAll(result, shapes);
	});
	return result;
};