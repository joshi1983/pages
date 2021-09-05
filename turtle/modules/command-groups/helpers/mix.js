import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { getDataTypeDescription } from './getDataTypeDescription.js';
import { Transparent } from '../../Transparent.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

export function mix(val1, val2, ratio) {
	if (typeof val1 === 'string')
		val1 = val1.toLowerCase();
	if (typeof val2 === 'string')
		val2 = val2.toLowerCase();
	if (typeof val1 === 'number' && typeof val2 === 'number')
		return val1 * ratio + val2 * (1 - ratio);
	else if (val1 instanceof Array && val2 instanceof Array && val1.length === val2.length) {
		const result = [];
		for (let i = 0; i < val1.length; i++) {
			result.push(mix(val1[i], val2[i], ratio));
		}
		return result;
	}
	else if (Colour.canBeInterprettedAsColour(val1) && Colour.canBeInterprettedAsColour(val2))
		return mix(new Colour(val1).rgbArray, new Colour(val2).rgbArray, ratio);
	else if (AlphaColour.canBeInterprettedAsAlphaColour(val1) && AlphaColour.canBeInterprettedAsAlphaColour(val2))
		return mix(new AlphaColour(val1).toARGBArray(), new AlphaColour(val2).toARGBArray(), ratio);
	else if (val2 === "transparent" && AlphaColour.canBeInterprettedAsAlphaColour(val1)) {
		const c = new AlphaColour(val1);
		c.alpha *= ratio;
		return c.toARGBArray();
	}
	else if (val2 === "transparent")
		throw new Error("When the second parameter is transparent, the first must be an alphacolor.  " +
				`Instead, val1 is of type ${getDataTypeDescription(val1)}`);
	else {
			throw new Error('The first 2 inputs must both be numbers, both be lists of equal length, both be colors, or both be alphacolors. ' + 
				`Instead, val1 is of type ${getDataTypeDescription(val1)} and val2 is of type ${getDataTypeDescription(val2)}`);
	}
};