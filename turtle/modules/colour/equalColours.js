import { AlphaColour } from '../AlphaColour.js';
import { Transparent } from '../Transparent.js';

export function equalColours(val1, val2) {
	if (val1 === val2)
		return true;
	if (val1 === Transparent ||
	val2 instanceof AlphaColour) {
		// swap.
		const temp = val1;
		val1 = val2;
		val2 = temp;
	}
	if (typeof val1 === 'object' && val1 !== null && typeof val1.equals === 'function') {
		return val1.equals(val2);
	}
	return false;
};