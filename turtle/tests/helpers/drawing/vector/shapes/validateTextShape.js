import { isNumber } from '../../../../../modules/isNumber.js';
import { validateShape } from './validateShape.js';

export function validateTextShape(textShape, logger) {
	validateShape(textShape, logger);
	if (typeof textShape.text !== 'string')
		logger(`Expected textShape.text to be a string but got ${textShape.text}`);
	if (!isNumber(textShape.rotationRadians))
		logger(`Expected textShape.rotationRadians to be a number but got ${textShape.rotationRadians}`);
};