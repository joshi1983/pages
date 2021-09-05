import { isNumber } from '../../../../../modules/isNumber.js';
import { validateShape } from './validateShape.js';

export function validateEllipseShape(ellipse, logger) {
	validateShape(ellipse, logger);
	if (!isNumber(ellipse.radius1))
		logger(`Expected ellipse.radius1 to be a number but got ${ellipse.radius1}`);
	if (!isNumber(ellipse.radius2))
		logger(`Expected ellipse.radius2 to be a number but got ${ellipse.radius2}`);
	if (!isNumber(ellipse.rotationRadians))
		logger(`Expected ellipse.rotationRadians to be a number but got ${ellipse.rotationRadians}`);
};