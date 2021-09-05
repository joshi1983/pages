import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

export function processStringLiteral(token, result) {
	const val = evaluateToken(token);
	result.append(valueToLiteralCode(val));
};