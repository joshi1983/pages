import { createTestDrawing } from '../../../helpers/createTestDrawing.js';
import { LineJoinStyle } from '../../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { optimizeDrawing } from '../../../../modules/drawing/vector/drawing_optimization/optimizeDrawing.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { VectorDrawing } from '../../../../modules/drawing/vector/VectorDrawing.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testOptimizeGeneralDrawing(logger) {
	const drawing = createTestDrawing();
	optimizeDrawing(drawing);
}

function testOptimizeLineSegmentJoinStyle(logger) {
	const style = new ShapeStyle();
	style.setLineJoinStyle(LineJoinStyle.Round);
	const lineSegment = new LineSegmentShape(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), style);
	const drawing = new VectorDrawing();
	drawing.addForegroundShape(lineSegment);
	optimizeDrawing(drawing);
	if (lineSegment.style.getLineJoinStyle() !== LineJoinStyle.Miter)
		logger(`Expected line join style to be optimized to Miter for a line segment but got ${LineJoinStyle.getNameFor(lineSegment.style.getLineJoinStyle())}`);
}

export function testOptimizeDrawing(logger) {
	wrapAndCall([
		testOptimizeGeneralDrawing,
		testOptimizeLineSegmentJoinStyle
	], logger);
};