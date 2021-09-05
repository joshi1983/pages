import { Transparent } from '../../../../Transparent.js';

export function colorToSVGStopColor(colour) {
	if (colour === Transparent)
		return 'black';
	else
		return colour.to6DigitHTMLCode();
}