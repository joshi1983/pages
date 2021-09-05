import { isNumber } from
'../../../../../../isNumber.js';

function hexToNumber(val) {
       return parseInt(val, 16);
}

export function evaluateNumberLiteral(token) {
	const val = token.val;
	if (val.startsWith('#'))
		return hexToNumber(val.substring(1));
	if (val.startsWith('0x'))
		return hexToNumber(val.substring(2));

	const result = parseFloat(val);
	if (!isNumber(result))
		return;

	return result;
};