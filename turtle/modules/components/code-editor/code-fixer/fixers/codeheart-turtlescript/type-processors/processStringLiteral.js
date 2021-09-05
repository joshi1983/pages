import { evaluateStringLiteral } from
'../../../../../../parsing/js-parsing/evaluateStringLiteral.js';
import { stringValueToWebLogoStringLiteral } from
'../../../../../../parsing/generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result) {
	const val = stringValueToWebLogoStringLiteral(evaluateStringLiteral(token.val));
	result.append(val);
};