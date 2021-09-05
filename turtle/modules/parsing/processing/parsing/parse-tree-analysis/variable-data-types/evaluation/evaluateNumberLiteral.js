import { isNumber } from
'../../../../../../isNumber.js';

export function evaluateNumberLiteral(token) {
	const result = parseFloat(token.val);
	if (!isNumber(result))
		return;

	return result;
};