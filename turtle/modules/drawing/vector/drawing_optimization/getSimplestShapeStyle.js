import { avoidAlphaColour } from './avoidAlphaColour.js';
import { CircleShape } from '../shapes/CircleShape.js';
import { EllipseShape } from '../shapes/EllipseShape.js';
import { LineJoinStyle } from '../shapes/style/LineJoinStyle.js';

export function getSimplestShapeStyle(shape) {
	const result = shape.style.deepClone();
	if (!shape.style.isPenVisible() || (shape instanceof CircleShape) || (shape instanceof EllipseShape)) {
		// make sure the line join is the default one.
		result.setLineJoinStyle(LineJoinStyle.Miter);
		if (!shape.style.isPenVisible()) {
			result.setPenWidth(0);
			if (result.getPenGradient() !== undefined)
				result.setPenGradient(undefined);
		}
	}
	return result;
};