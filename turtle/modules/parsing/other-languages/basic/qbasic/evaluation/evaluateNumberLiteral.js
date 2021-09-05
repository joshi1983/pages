import { evaluateNumberLiteralString } from './evaluateNumberLiteralString.js';

export function evaluateNumberLiteral(token) {
	return evaluateNumberLiteralString(token.val);
};