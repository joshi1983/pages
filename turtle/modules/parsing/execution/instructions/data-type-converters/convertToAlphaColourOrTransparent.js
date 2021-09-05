import { AlphaColour } from '../../../../AlphaColour.js';
import { Transparent } from '../../../../Transparent.js';

export function convertToAlphaColourOrTransparent(val) {
	if (val === Transparent || val instanceof AlphaColour)
		return val;
	if (typeof val === 'string' && val.toLowerCase() === 'transparent')
		return Transparent;

	return new AlphaColour(val);
};