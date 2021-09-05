import { circle } from './circle.js';
import { CircleShape } from '../../../../drawing/vector/shapes/CircleShape.js';
import { lineSegment } from './lineSegment.js';
import { LineSegmentShape } from '../../../../drawing/vector/shapes/LineSegmentShape.js';
import { orientedCircle } from './orientedCircle.js';
import { OrientedCircleShape } from '../../../../drawing/vector/shapes/OrientedCircleShape.js';
import { path } from './path.js';
import { PathShape } from '../../../../drawing/vector/shapes/PathShape.js';

export function shape(shape, degreesPerArcDivision) {
	if (shape instanceof PathShape)
		return path(shape, degreesPerArcDivision);
	if (shape instanceof CircleShape)
		return circle(shape, degreesPerArcDivision);
	if (shape instanceof OrientedCircleShape)
		return orientedCircle(shape, degreesPerArcDivision);
	if (shape instanceof LineSegmentShape)
		return [lineSegment(shape)];
	const result = [];
	return result;
};