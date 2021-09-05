import { ArcShape } from '../shapes/ArcShape.js';
import { CircleShape } from '../shapes/CircleShape.js';
import { EllipseArcShape } from '../shapes/EllipseArcShape.js';
import { EllipseShape } from '../shapes/EllipseShape.js';
import { equalWithinThreshold } from '../../../equalWithinThreshold.js';
import { getSimplestShapeStyle } from './getSimplestShapeStyle.js';
import { PathShape } from '../shapes/PathShape.js';
import { pathToCircle } from './pathToCircle.js';
import { ShapeStyle } from '../shapes/style/ShapeStyle.js';

const twoPi = Math.PI * 2;

export function getSimplestShape(shape) {
	shape.style = getSimplestShapeStyle(shape, false);
	if (shape instanceof PathShape) {
		const circle = pathToCircle(shape);
		if (circle !== undefined)
			return circle;
	}
	// if the radii are equal in an ellipse, it is also a circle.
	if (shape instanceof EllipseArcShape && shape.radius1 === shape.radius2)
		shape = new ArcShape(shape.position, shape.rotationRadians, shape.radius1, shape.angle, shape.style);
	else if (shape instanceof EllipseShape && shape.radius1 === shape.radius2)
		return new CircleShape(shape.position, shape.radius1, shape.style);

	if (shape instanceof ArcShape) {
		if (Math.abs(shape.angle) >= twoPi ||
		equalWithinThreshold(Math.abs(shape.angle), twoPi, 0.0001)) {
			const s = new ShapeStyle(shape.style);
			s.clearFill(); // just to be sure.
			return new CircleShape(shape.position, shape.radius, s);
		}
	}
	else if (shape instanceof EllipseArcShape) {
		if (shape.angle > twoPi) {
			return shape.toCorrespondingEllipse();
		}
	}
	return shape;
};