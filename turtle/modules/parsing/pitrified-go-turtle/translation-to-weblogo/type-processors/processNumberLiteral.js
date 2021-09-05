import { evaluateToken } from '../../evaluation/evaluateToken.js';
import { valueToLiteralCode } from '../../../../valueToLiteralCode.js';

export function processNumberLiteral(token, result, settings) {
	const val = evaluateToken(token);
	if (val === undefined)
		result.append(token.val); // will result in an error in WebLogo but this is the best way to pass the remaining of the translation task to the human user.
	else {
		result.append(valueToLiteralCode(val));
	}
};