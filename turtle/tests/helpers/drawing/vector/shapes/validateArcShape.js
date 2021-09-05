import { isNumber } from '../../../../../modules/isNumber.js';
import { validateShape } from './validateShape.js';

export function validateArcShape(arc, logger) {
	validateShape(arc, logger);
	if (!isNumber(arc.radius))
		logger(`Expected radius to be a number but found ${arc.radius}`);
	if (!isNumber(arc.angle))
		logger(`Expected angle to be a number but found ${arc.angle}`);
	if (!isNumber(arc.rotationRadians))
		logger(`Expected rotationRadians to be a number but found ${arc.rotationRadians}`);
};