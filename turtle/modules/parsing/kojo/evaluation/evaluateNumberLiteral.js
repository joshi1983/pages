import { evaluateNumberLiteralString } from './evaluateNumberLiteralString.js';
import { isNumber } from '../../../isNumber.js';

export function evaluateNumberLiteral(token) {
	const result = evaluateNumberLiteralString(token.val);
	if (isNumber(result))
		return result;
};