import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { Colour } from '../../../modules/Colour.js';
import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { createTestDrawing2 } from '../../helpers/createTestDrawing2.js';
import { createTestDrawingWith3DPointCloud } from '../../helpers/createTestDrawingWith3DPointCloud.js';
import { createTestDrawingWithAllShapes } from '../../helpers/createTestDrawingWithAllShapes.js';
import { createTestDrawingWithCustomEasing } from '../../helpers/createTestDrawingWithCustomEasing.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { styleToColour } from '../../../modules/drawing-menu/download/styleToColour.js';
await Colour.asyncInit();

export function testStyleToColour(logger) {
	const drawings = [
	createTestDrawing(),
	createTestDrawing2(),
	createTestDrawingWith3DPointCloud(),
	createTestDrawingWithAllShapes(),
	createTestDrawingWithCustomEasing()
	];
	const shapes = [];
	for (const drawing of drawings) {
		ArrayUtils.pushAll(shapes, drawing.getShapesArray());
	}
	const styles = shapes.map(shape => shape.style);
	styles.forEach(function(style, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = styleToColour(style);
		if (!(result instanceof Colour))
			plogger(`Expected styleToColour to return a Colour but got ${result}`);
	});
};