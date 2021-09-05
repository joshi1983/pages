import { AlphaColour } from '../../../../AlphaColour.js';
import { Transparent } from '../../../../Transparent.js';

export function areAllColourStopsOpaque(gradient) {
	const stops = gradient.colorStops;
	for (const stop of stops.values()) {
		if (stop.colour === Transparent)
			return false;
		else if (stop.colour instanceof AlphaColour && !AlphaColour.isOpaque(stop.colour))
			return false;
	}
	return true;
};