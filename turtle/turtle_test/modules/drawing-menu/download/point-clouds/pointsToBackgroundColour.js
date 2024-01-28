import { Colour } from '../../../Colour.js';
import { getBlue } from '../../../colour/getBlue.js';
import { getGreen } from '../../../colour/getGreen.js';
import { getRed } from '../../../colour/getRed.js';

const black = new Colour(0, 0, 0);
const white = new Colour(255, 255, 255);

export function pointsToBackgroundColour(points) {
	if (points.length === 0)
		return white;
	let red = 0, green = 0, blue = 0;
	for (let i = 0; i < points.length; i++) {
		const pc = points[i].colour;
		red += getRed(pc);
		green += getGreen(pc);
		blue += getBlue(pc);
	}
	red /= points.length;
	green /= points.length;
	blue /= points.length;
	if (red + green + blue < 3 * 128)
		return white;
	else
		return black;
};