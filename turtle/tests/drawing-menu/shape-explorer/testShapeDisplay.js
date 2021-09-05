import { ArcShape } from '../../../modules/drawing/vector/shapes/ArcShape.js';
import { CircleShape } from '../../../modules/drawing/vector/shapes/CircleShape.js';
import { EllipseShape } from '../../../modules/drawing/vector/shapes/EllipseShape.js';
import { LineSegmentShape } from '../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { ShapeDisplay } from '../../../modules/drawing-menu/shape-explorer/ShapeDisplay.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testWithVariousShapes(logger) {
	const shapes = [
		new LineSegmentShape(new Vector3D(1, 2, 3), new Vector3D(2, 3, 4)),
		new CircleShape(new Vector3D(1, 2, 3), 50),
		new EllipseShape(new Vector3D(1, 2, 3), 0, 50, 100),
		new ArcShape(new Vector3D(1, 2, 3), 0, 100, Math.PI),
	];
	shapes.forEach(function(shape, index) {
		const shapeDisplay = new ShapeDisplay(shape, index);
		const result = shapeDisplay.toDiv();
		if (!(result instanceof Element))
			logger(`Shape ${index} expected to be an Element but it is not.  The result was: ` + result);
		shapeDisplay.unbind();
	});
}

export function testShapeDisplay(logger) {
	wrapAndCall([
		testWithVariousShapes
	], logger);
};