import { convertGradientPoint } from './convertGradientPoint.js';
import { Gradient } from '../vector/shapes/gradients/Gradient.js';
import { RadialGradient } from '../vector/shapes/gradients/RadialGradient.js';
import { SpreadMethod } from '../vector/shapes/gradients/SpreadMethod.js';

export function createRadialGradient(outerCentre, focus, radius, colorStops, spreadMethod) {
	return new RadialGradient(
		 Gradient.sanitizeColorStops(colorStops),
		 convertGradientPoint(outerCentre),
		 convertGradientPoint(focus),
		 radius,
		 SpreadMethod.parse(spreadMethod.toLowerCase())
	);
};