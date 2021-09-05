import { isNumber } from '../../../../../modules/isNumber.js';
import { validateShape } from './validateShape.js';

export function validateSphereShape(sphere, logger) {
	validateShape(sphere, logger);
	if (!isNumber(sphere.radius))
		logger(`sphere.radius expected to be a number but got ${sphere.radius}`);
};