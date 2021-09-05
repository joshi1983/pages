import { AlphaColour } from '../../../../AlphaColour.js';

export function convertToAlphaColour(val) {
	if (val instanceof AlphaColour)
		return val;
	return new AlphaColour(val);
};