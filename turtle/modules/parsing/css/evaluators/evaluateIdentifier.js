import { Colour } from '../../../Colour.js';
import { cssColorNameToHex } from '../cssColorNameToHex.js';

// These values are from
// https://developer.mozilla.org/en-US/docs/Web/CSS/calc-constant

const vals = new Map([
	['e', Math.E],
	['infinity', Number.POSITIVE_INFINITY],
	['-infinity', Number.NEGATIVE_INFINITY],
	['NaN', Math.NaN],
	['pi', Math.PI]
]);

export function evaluateIdentifier(token) {
	let result = vals.get(token.val);
	if (result !== undefined)
		return result;
	result = cssColorNameToHex(token.val);
	if (result !== undefined)
		return new Colour(result);
};