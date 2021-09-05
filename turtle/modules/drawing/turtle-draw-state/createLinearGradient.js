import { convertGradientPoint } from './convertGradientPoint.js';
import { Gradient } from '../vector/shapes/gradients/Gradient.js';
import { LinearGradient } from '../vector/shapes/gradients/LinearGradient.js';
import { SpreadMethod } from '../vector/shapes/gradients/SpreadMethod.js';

export function createLinearGradient(p1, p2, colorStops, spreadMethod) {
	return new LinearGradient(
		 Gradient.sanitizeColorStops(colorStops),
		 convertGradientPoint(p1),
		 convertGradientPoint(p2),
		 SpreadMethod.parse(spreadMethod.toLowerCase())
	);
};