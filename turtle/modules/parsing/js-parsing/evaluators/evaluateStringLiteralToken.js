import { evaluateStringLiteral } from '../evaluateStringLiteral.js';

export function evaluateStringLiteralToken(token) {
	return evaluateStringLiteral(token.val);
};