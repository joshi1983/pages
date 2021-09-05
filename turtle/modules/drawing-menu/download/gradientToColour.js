import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { mixColourish } from '../../command-groups/helpers/mixColourish.js';
import { Transparent } from '../../Transparent.js';
const black = new Colour(0, 0, 0);

function simplifyColour(colour) {
	/*
	This is true if a color stop references an easing function and a colour.
	*/
	if (colour.colour !== undefined)
		return colour.colour;
	else
		return colour;
}

export function gradientToColour(gradient) {
	const colorStops = gradient.colorStops;
	const colorsToMix = [];
	for (const val of colorStops.values()) {
		if (val !== Transparent && val.colour !== Transparent)
			colorsToMix.push(val);
	}
	if (colorsToMix.length === 1)
		return simplifyColour(colorsToMix[0]);
	if (colorsToMix.length >= 2)
		return new AlphaColour(mixColourish(simplifyColour(colorsToMix[0]), simplifyColour(colorsToMix[1]), 0.5));
	/* 
	It would be nice to mix more than 2 colours if there are more but getting the blending 
	ratios correct for an even mix between all colours can be complicated.
	The ratios would need to be calculated like they are for merging snapshots for motion blur.
	*/
	return black;
};