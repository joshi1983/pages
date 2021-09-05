import { AlphaColour } from '../../../../AlphaColour.js';
import { areAllColourStopsOpaque } from './areAllColourStopsOpaque.js';
import { Colour } from '../../../../Colour.js';
import { MixBlendMode } from '../../shapes/mix-blend-modes/MixBlendMode.js';
import { Transparent } from '../../../../Transparent.js';

export function isFillOpaque(style) {
	const fillGradient = style.getFillGradient();
	if (fillGradient !== undefined) {
		return style.getFillBlendMode() === MixBlendMode.Normal &&
			areAllColourStopsOpaque(fillGradient);
	}
	if (style.getFillBlendMode() !== MixBlendMode.Normal)
		return false;
	const color = style.getFillColor();
	if (color === Transparent)
		return false;
	if (color instanceof Colour)
		return true;
	return AlphaColour.isOpaque(color);
};