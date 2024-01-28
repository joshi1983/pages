import { AlphaColour } from '../../../../AlphaColour.js';
import { areAllColourStopsOpaque } from './areAllColourStopsOpaque.js';
import { Colour } from '../../../../Colour.js';
import { Transparent } from '../../../../Transparent.js';

export function isPenOpaque(style) {
	if (style.getPenWidth() === 0)
		return false;
	const penGradient = style.getPenGradient();
	if (penGradient !== undefined) {
		return areAllColourStopsOpaque(penGradient);
	}
	const color = style.getPenColor();
	if (color === Transparent)
		return false;
	if (color instanceof Colour)
		return true;
	return AlphaColour.isOpaque(color);
};