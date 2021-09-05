import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { gradientToColour } from './gradientToColour.js';
import { Transparent } from '../../Transparent.js';
const black = new Colour(0, 0, 0);

export function styleToColour(style) {
	const gradient = style.getPenGradient();
	let color;
	if (gradient !== undefined) {
		color = gradientToColour(gradient);
	}
	if (color === undefined)
		color = style.getPenColor();
	if (color === Transparent)
		return black;
	if (color instanceof AlphaColour)
		return AlphaColour.getAsColour(color);
	return color;
};