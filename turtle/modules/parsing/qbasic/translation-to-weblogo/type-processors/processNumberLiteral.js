import { evaluateNumberLiteral } from
'../../evaluation/evaluateNumberLiteral.js';
import { isHexNumberLiteralStart } from
'../../scanning/isHexNumberLiteralStart.js';
import { isOctalNumberLiteralStart } from
'../../scanning/isOctalNumberLiteralStart.js';

export function processNumberLiteral(token, result, options) {
	if (isHexNumberLiteralStart(token.val) ||
	isOctalNumberLiteralStart(token.val)) {
		result.append(' ' + evaluateNumberLiteral(token));
	}
	else {
		result.append(' ' + token.val);
	}
};