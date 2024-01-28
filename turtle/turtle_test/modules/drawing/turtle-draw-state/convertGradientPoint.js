import { Vector2D } from '../vector/Vector2D.js';

export function convertGradientPoint(p) {
	if (p.length > 2)
		p = p.slice(0, 2);
	return new Vector2D(p);
};