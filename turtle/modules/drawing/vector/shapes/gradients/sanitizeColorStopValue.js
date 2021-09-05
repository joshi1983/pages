import { AlphaColour } from '../../../../AlphaColour.js';
import { Colour } from '../../../../Colour.js';
import { Transparent } from '../../../../Transparent.js';

export async function asyncInit() {
	await AlphaColour.asyncInit();
	await Colour.asyncInit();
}

export function sanitizeColorStopValue(colour) {
	// convert the colour to a more internally useful data type.
	if (typeof colour === 'string' && colour.toLowerCase() === 'transparent')
		colour = Transparent;
	else if (!(colour instanceof Colour) && Colour.canBeInterprettedAsColour(colour))
		colour = new Colour(colour);
	else if (!(colour instanceof AlphaColour) && AlphaColour.canBeInterprettedAsAlphaColour(colour))
		colour = new AlphaColour(colour);
	return colour;
};