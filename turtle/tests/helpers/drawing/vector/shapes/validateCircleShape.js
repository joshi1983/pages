import { validateShape } from './validateShape.js';

export function validateCircleShape(circle, logger) {
	validateShape(circle, logger);
	if (!isNumber(circle.radius))
		logger(`Expected circle.radius to be a number but got ${circle.radius}`);
};