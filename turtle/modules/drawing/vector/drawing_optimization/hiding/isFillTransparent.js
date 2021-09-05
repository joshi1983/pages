import { AlphaColour } from '../../../../AlphaColour.js';
import { Transparent } from '../../../../Transparent.js';

export function isFillTransparent(style) {
	const gradient = style.getFillGradient();
	if (gradient !== undefined)
		return false;
	const color = style.getFillColor();
	if (color === Transparent)
		return true;
	if (AlphaColour.isTransparent(color))
		return true;
	return false;
};