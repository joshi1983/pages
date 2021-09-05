import { AlphaColour } from '../../../../AlphaColour.js';

export function convertToAlphaColour(val) {
	if (val instanceof AlphaColour)
		return val;
	if (val < 0)
		val = val & 0xf;
	return new AlphaColour(val);
};