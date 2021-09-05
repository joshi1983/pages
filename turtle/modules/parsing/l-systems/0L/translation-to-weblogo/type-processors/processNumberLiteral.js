import { valueToLiteralCode } from '../../../../../valueToLiteralCode.js';

export function processNumberLiteral(token, result) {
	const val = parseFloat(token.val);
	result.append(valueToLiteralCode(val));
};