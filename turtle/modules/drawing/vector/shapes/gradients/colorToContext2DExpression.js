import { AlphaColour } from '../../../../AlphaColour.js';
import { Colour } from '../../../../Colour.js';
import { Transparent } from '../../../../Transparent.js';

export async function asyncInit() {
	await AlphaColour.asyncInit();
	await Colour.asyncInit();
};

export function colorToContext2DExpression(colour) {
	if (colour === Transparent)
		return 'transparent';
	else if (colour instanceof Colour)
		return colour.toString();
	else
		return AlphaColour.getRGBAExpression(colour);
}