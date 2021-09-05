import { Colour } from '../../../../Colour.js';

export function convertToColour(val) {
	if (val instanceof Colour)
		return val;
	if (val < 0)
		val = val & 0xf;
	return new Colour(val);
};