import { stringValueToWebLogoStringLiteral } from './stringValueToWebLogoStringLiteral.js';
import { valueToString } from '../../../../../valueToString.js';

export function valueToWebLogoExpression(value) {
	if (typeof value === 'string')
		return stringValueToWebLogoStringLiteral(value);
	if (value instanceof Array)
		return valueToString(value);
	return '' + value;
};