import { RadialGradient } from '../../../../../modules/drawing/vector/shapes/gradients/RadialGradient.js';
import { SpreadMethod } from '../../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Vector2D } from '../../../../../modules/drawing/vector/Vector2D.js';

export function stopsToGradient(stops) {
	const p1 = new Vector2D(0, 0);
	stops = new Map(stops);
	const radius = 15;
	return new RadialGradient(stops, p1, p1, radius, SpreadMethod.Pad)
};