import { Transparent } from '../../../Transparent.js';

export function getJSPDFStyle(style) {
	if (style.getFillColor() === Transparent)
		return 'D'; // stroke only
	else if (!style.isPenVisible())
		return 'F'; // fill only
	else
		return 'FD'; // fill and then stroke
};