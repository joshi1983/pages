import { Colour } from '../../Colour.js';
import { getAverageColour } from '../../colour/getAverageColour.js';

const black = new Colour(0, 0, 0);
const white = new Colour(255, 255, 255);

export function foregroundColoursToBackgroundColour(foregroundColours) {
	const c = getAverageColour(foregroundColours);
	if (c.isDark())
		return white;
	else
		return black;
};