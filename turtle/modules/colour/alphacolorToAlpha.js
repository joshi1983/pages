import { Transparent } from '../Transparent.js';

export function alphacolorToAlpha(color) {
	if (color === Transparent)
		return 0;
	if (color.alpha === undefined)
		return 255;
	return color.alpha;
};