import { evaluateStringLiteralString } from './evaluateStringLiteralString.js';

export function evaluateStringLiteral(token) {
	return evaluateStringLiteralString(token.val);
};