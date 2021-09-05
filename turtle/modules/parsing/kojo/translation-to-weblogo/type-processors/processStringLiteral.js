import { evaluateStringLiteral } from
'../../evaluation/evaluateStringLiteral.js';
import { valueToLiteralCode } from
'../../../../valueToLiteralCode.js';

export function processStringLiteral(token, result, settings) {
	const val = evaluateStringLiteral(token);
	if (val !== undefined)
		result.append(valueToLiteralCode(val));
	else
		result.append(token.val); // this should be rare.
};