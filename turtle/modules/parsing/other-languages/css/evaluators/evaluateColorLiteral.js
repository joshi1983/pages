import { cssColorNameToHex } from '../cssColorNameToHex.js';

export function evaluateColorLiteral(token) {
	const val = cssColorNameToHex(token.val);
	return val;
};