import { FontWeight } from '../../../drawing/vector/shapes/style/FontWeight.js';
const fontWeights = FontWeight.getNames();

export function fontWeight(s) {
	s = s.trim().toLowerCase();
	if (fontWeights.indexOf(s) === -1)
		return `Unsupported font weight "${s}".  The font weight must be one of ${fontWeights.join(',')}`;
};