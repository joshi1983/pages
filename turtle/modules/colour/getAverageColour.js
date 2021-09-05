import { Colour } from '../Colour.js';
import { getBlue } from './getBlue.js';
import { getGreen } from './getGreen.js';
import { getRed } from './getRed.js';

export function getAverageColour(colours) {
	if (colours.length === 0)
		return new Colour(0, 0, 0);
		// The average not really defined but we'll return a default colour 
		// of black in the interest of always returning a Colour.
	let red = 0, green = 0, blue = 0;
	for (let i = 0; i < colours.length; i++) {
		const c = colours[i];
		red += getRed(c);
		green += getGreen(c);
		blue += getBlue(c);
	}
	red /= colours.length;
	green /= colours.length;
	blue /= colours.length;
	return new Colour(red, green, blue);
};