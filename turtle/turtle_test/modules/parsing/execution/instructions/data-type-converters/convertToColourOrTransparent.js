import { Colour } from '../../../../Colour.js';
import { Transparent } from '../../../../Transparent.js';

export function convertToColourOrTransparent(val) {
	if (val === Transparent || val instanceof Colour)
		return val;
	return new Colour(val);
};