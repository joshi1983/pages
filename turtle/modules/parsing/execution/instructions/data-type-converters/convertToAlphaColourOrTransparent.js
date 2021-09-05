import { AlphaColour } from '../../../../AlphaColour.js';
import { Transparent } from '../../../../Transparent.js';

export function convertToAlphaColourOrTransparent(val) {
	if (val === Transparent || val instanceof AlphaColour)
		return val;

	return new AlphaColour(val);
};