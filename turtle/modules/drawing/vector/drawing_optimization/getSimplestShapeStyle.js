import { avoidAlphaColour } from './avoidAlphaColour.js';
import { CircleShape } from '../shapes/CircleShape.js';
import { EllipseShape } from '../shapes/EllipseShape.js';
import { LineCap } from '../shapes/style/LineCap.js';
import { LineJoinStyle } from '../shapes/style/LineJoinStyle.js';
import { PathShape } from '../shapes/PathShape.js';

export function getSimplestShapeStyle(shape) {
	const result = shape.style.deepClone();
	if (!shape.style.isPenVisible()) {
		result.setLineJoinStyle(LineJoinStyle.Miter);
		result.setLineCap(LineCap.Butt);
	}
	if (!shape.style.isPenVisible()) {
		result.setPenWidth(0);
		if (result.getPenGradient() !== undefined)
			result.setPenGradient(undefined);
	}
	if ((shape instanceof CircleShape) || (shape instanceof EllipseShape) ||
	(shape instanceof PathShape && shape.isClosed)) {
		// make sure the line join is the default one.
		result.setLineCap(LineCap.Butt);
	}
	return result;
};