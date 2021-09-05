import { AlphaColour } from '../AlphaColour.js';
import { Colour } from '../Colour.js';
import { Transparent } from '../Transparent.js';

const black = new Colour(0, 0, 0);

export function coerceToColour(c) {
	if (c instanceof AlphaColour)
		return AlphaColour.getAsColour(c);
	else if (c === Transparent)
		return black;
	else
		return c;
};