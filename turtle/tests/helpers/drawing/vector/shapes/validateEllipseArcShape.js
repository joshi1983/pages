import { validateObjectNumbers } from './validateObjectNumbers.js';
import { validateShape } from './validateShape.js';

export function validateEllipseArcShape(ellipseArcShape, logger) {
	validateShape(ellipseArcShape, logger);
	validateObjectNumbers(ellipseArcShape, [
	'rotationRadians', 'radius1', 'radius2', 'angle', 'startAngle', 'radiiRatio'
	], logger);
};