import { evaluateStringLiteral } from
'../../evaluateStringLiteral.js';
import { stringValueToWebLogoStringLiteral } from
'../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result) {
	const val = stringValueToWebLogoStringLiteral(evaluateStringLiteral(token.val));
	result.append(val);
};