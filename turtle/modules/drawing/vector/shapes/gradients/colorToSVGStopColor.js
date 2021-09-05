import { getShortestRGBHexCode } from '../../../../colour/getShortestRGBHexCode.js';
import { Transparent } from '../../../../Transparent.js';

export function colorToSVGStopColor(colour) {
	if (colour === Transparent)
		return 'black';
	else
		return getShortestRGBHexCode(colour);
}