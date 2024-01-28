import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';
import { Vector2D } from '../../../drawing/vector/Vector2D.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

function toVector2D(v) {
	if (v instanceof Vector3D)
		return v.getXYVector();
	else
		return v;
}

export function getPointsFromShape(shape) {
	if (shape instanceof LineSegmentShape)
		return [toVector2D(shape.position), toVector2D(shape.endPoint)];
	else if (shape instanceof PathShape) {
		return shape.elements.map(toVector2D);
	}
	else
		throw new Error('The only supported shapes are LineSegmentShape and PathShape');
};