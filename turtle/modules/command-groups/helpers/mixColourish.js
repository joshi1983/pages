import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { mixNumbers } from './mixNumbers.js';
import { mixNumberArrays } from './mixNumberArrays.js';
import { Transparent } from '../../Transparent.js';

/*
Mixes when val1 and val2 might be Transparent, Colour, or AlphaColour.
*/
export function mixColourish(val1, val2, ratio) {
	if (typeof val1 !== 'object' || typeof val2 !== 'object')
		throw new Error(`Invalid types passed to mixColourish.  Each must be Transparent, Colour, or AlphaColour but got ${val1} and ${val2}`);
	if (val1 === val2)
		return val1;
	if (typeof val1.equals === 'function' && val1.equals(val2))
		return val1;
	if ((val1 instanceof Colour) && (val2 instanceof Colour))
		return new Colour(mixNumberArrays(val1.rgbArray, val2.rgbArray, ratio));
	if ((val1 instanceof AlphaColour) && (val2 instanceof AlphaColour))
		return new AlphaColour(mixNumberArrays(val1.toARGBArray(), val2.toARGBArray(), ratio));
	if (val1 === Transparent) {
		// swap because Transparent is not allowed as first argument to the mix function.
		val1 = val2;
		val2 = Transparent;
		ratio = 1 - ratio;
		// invert the ratio so it is meaningfully the same after swap.
	}
	if (val2 === Transparent) {
		if (val1 instanceof Colour)
			return new AlphaColour([255 * ratio, ...val1.rgbArray]);
		else
			return new AlphaColour([mixNumbers(val1.alpha, 0, ratio), ...val1.rgbArray]);
	}
	if (!(val1 instanceof AlphaColour))
		val1 = new AlphaColour(val1);
	if (!(val2 instanceof AlphaColour))
		val2 = new AlphaColour(val2);
	return new AlphaColour(mixNumberArrays(val1.toARGBArray(), val2.toARGBArray(), ratio));;
};