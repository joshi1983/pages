import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { circleToLineSegments } from '../../../../modules/drawing/drawers/wire/circleToLineSegments.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testCircleToLineSegments(logger) {
	const centre = new Vector3D(1, 2, 3);
	const circle = new CircleShape(centre, 100);
	const lines = circleToLineSegments(circle);
	if (!(lines instanceof Array))
		logger('lines expected to be an Array but got ' + lines);
	else if (lines.length < 3)
		logger(`There must be at least 3 line segments to represent a circle but got ${lines.length}`);
};