import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { Vector2DDrawing } from '../../../modules/drawing/vector/Vector2DDrawing.js';

export function testVector2DDrawing(logger) {
	const d = new Vector2DDrawing();
	d.getBoundingBox();
	const testDrawing = createTestDrawing();
	testDrawing.getBoundingBox();
	const numTainted = testDrawing.countTaintedShapes();
	if (numTainted !== 0)
		logger('Expected 0 tainted shapes but got ' + numTainted);
	const untaintedDrawing = testDrawing.getWithoutTaintedShapes();
	if (!(untaintedDrawing instanceof Vector2DDrawing))
		logger('Expected a Vector2DDrawing but got something else.  untaintedDrawing = ' + untaintedDrawing);
	else if (untaintedDrawing.foreground.shapes.length !== testDrawing.foreground.shapes.length)
		logger(`Expected ${testDrawing.foreground.shapes.length} shapes but got ${untaintedDrawing.foreground.shapes.length}`);
	const hasTaintedShapes = d.hasTaintedShapes();
	if (hasTaintedShapes !== false)
		logger('Expected false but got ' + hasTaintedShapes);
	d.addForegroundShapes([]);
};