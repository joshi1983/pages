import { convertGradientPoint } from './convertGradientPoint.js';
import { EllipticalGradient } from '../vector/shapes/gradients/EllipticalGradient.js';
import { Gradient } from '../vector/shapes/gradients/Gradient.js';
import { SpreadMethod } from '../vector/shapes/gradients/SpreadMethod.js';

export function createEllipticalGradient(outerCentre, radius1, radius2, rotationRadians, colorStops, spreadMethod) {
	return new EllipticalGradient(
		 Gradient.sanitizeColorStops(colorStops),
		 convertGradientPoint(outerCentre),
		 radius1,
		 radius2,
		 rotationRadians,
		 SpreadMethod.parse(spreadMethod.toLowerCase())
	);
};