import { Colour } from '../../Colour.js';
import { Transparent } from '../../Transparent.js';

export function colorToCommandReturnValue(color) {
	if (color === Transparent)
		return color;
	else if (color instanceof Colour) {
		return color.toArray();
	}
	else
		return color.toARGBArray();
};