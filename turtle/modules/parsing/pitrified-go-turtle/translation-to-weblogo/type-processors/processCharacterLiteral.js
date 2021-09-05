import { evaluateCharacterLiteral } from
'../../evaluation/evaluateCharacterLiteral.js';
import { valueToLiteralCode } from
'../../../../valueToLiteralCode.js';

export function processCharacterLiteral(token, result, settings) {
	const val = evaluateCharacterLiteral(token);
	if (val !== undefined)
		result.append(valueToLiteralCode(val));
	else
		result.append(token.val); // this should be rare.
};