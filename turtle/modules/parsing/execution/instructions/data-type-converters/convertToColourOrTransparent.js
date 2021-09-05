import { Colour } from '../../../../Colour.js';
import { Transparent } from '../../../../Transparent.js';

export function convertToColourOrTransparent(val) {
	if (val === Transparent || val instanceof Colour)
		return val;
	if (val < 0)
		val = val & 0xf;
	return new Colour(val);
};