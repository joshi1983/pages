import { isHexNumberLiteralStart } from '../scanning/isHexNumberLiteralStart.js';
import { isOctalNumberLiteralStart } from '../scanning/isOctalNumberLiteralStart.js';

export function evaluateNumberLiteral(token) {
	if (isHexNumberLiteralStart(token.val))
		return parseInt(token.val.substring(2), 16);
	if (isOctalNumberLiteralStart(token.val))
		return parseInt(token.val.substring(2), 8);

	return parseFloat(token.val);
};