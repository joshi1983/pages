import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { gradientToColour } from './gradientToColour.js';
import { Transparent } from '../../Transparent.js';
const black = new Colour(0, 0, 0);

export function styleToColour(style) {
	const gradient = style.getPenGradient();
	if (gradient !== undefined) {
		const color = gradientToColour(gradient);
		return color;
	}
	const penColor = style.getPenColor();
	if (penColor === Transparent)
		return black;
	if (penColor instanceof AlphaColour)
		return AlphaColour.getAsColour(penColor);
	return penColor;
};