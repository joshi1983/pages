import { AlphaColour } from '../../../../AlphaColour.js';
import { areAllColourStopsOpaque } from './areAllColourStopsOpaque.js';
import { Colour } from '../../../../Colour.js';
import { MixBlendMode } from '../../shapes/mix-blend-modes/MixBlendMode.js';
import { Transparent } from '../../../../Transparent.js';

export function isPenOpaque(style) {
	if (style.getPenWidth() === 0)
		return false;
	if (style.getPenBlendMode() !== MixBlendMode.Normal)
		return false; // the background will very likely affect the result.

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