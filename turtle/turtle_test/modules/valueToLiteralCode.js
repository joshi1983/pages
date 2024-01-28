import { stringValueToWebLogoStringLiteral } from
'./parsing/python-parsing/translation-to-weblogo/type-processors/helpers/stringValueToWebLogoStringLiteral.js';
import { valueToString } from './valueToString.js';

export function valueToLiteralCode(val) {
	if (typeof val === 'string') {
		return stringValueToWebLogoStringLiteral(val);
	}
	if (val instanceof Array) {
		return '[' + val.map(valueToLiteralCode).join(' ') + ']';
	}
	return valueToString(val);
};