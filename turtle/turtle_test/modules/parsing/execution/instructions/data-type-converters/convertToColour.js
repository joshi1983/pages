import { Colour } from '../../../../Colour.js';

export function convertToColour(val) {
	if (val instanceof Colour)
		return val;
	return new Colour(val);
};