import { stringLiteralToValue } from '../../stringLiteralToValue.js';
import { stringValueToWebLogoStringLiteral } from
'../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result) {
	const val = stringLiteralToValue(token.val);
	result.append(stringValueToWebLogoStringLiteral(val));
};