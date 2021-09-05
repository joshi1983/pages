import { AlphaColour } from '../../../../AlphaColour.js';
import { Transparent } from '../../../../Transparent.js';

export function convertToAlphaColourOrTransparent(val) {
	if (val === Transparent || val instanceof AlphaColour)
		return val;
	if (val === null)
		throw new Error(`null or no value can not be converted to AlphaColour`);

	return new AlphaColour(val);
};