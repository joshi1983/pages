import { AlphaColour } from '../../../../AlphaColour.js';
import { Transparent } from '../../../../Transparent.js';

export function colorToSVGOpacityExpression(colour) {
	if (colour === Transparent)
		return ' stop-opacity="0"';
	else if (colour instanceof AlphaColour)
		return ' stop-opacity="' + AlphaColour.getOpacityRatio(colour) + '"';
	else
		return '';
}