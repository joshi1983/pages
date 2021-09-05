import { evaluateStringLiteralString } from
'../../evaluation/evaluateStringLiteralString.js';
import { stringValueToWebLogoStringLiteral } from
'../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result) {
	const val = stringValueToWebLogoStringLiteral(evaluateStringLiteralString(token.val));
	result.append(val);
};