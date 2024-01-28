import { Colour } from '../../Colour.js';
import { valueToString } from '../../valueToString.js';

export function equalp(val1, val2) {
	if (val2 instanceof Colour && !(val1 instanceof Colour)) {
		// swap.
		const temp = val1;
		val1 = val2;
		val2 = temp;
	}
	if (val1 instanceof Colour && !(val2 instanceof Colour)) {
		try {
			val2 = new Colour(val2);
		}
		catch (e) {
			return false;
		}
	}
	if (val1 instanceof Colour)
		return val1.equals(val2);
	if (val1 instanceof Array || typeof val1 === 'boolean' || typeof val1 === 'string')
		val1 = valueToString(val1).toLowerCase();
	if (val2 instanceof Array || typeof val2 === 'boolean' || typeof val2 === 'string')
		val2 = valueToString(val2).toLowerCase();
	return val1 == val2;
};