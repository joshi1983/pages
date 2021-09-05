import { Colour } from '../../modules/Colour.js';
import { RadialGradient } from '../../modules/drawing/vector/shapes/gradients/RadialGradient.js';
import { SpreadMethod } from '../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Transparent } from '../../modules/Transparent.js';
import { Vector2D } from '../../modules/drawing/vector/Vector2D.js';

export function createRadialGradient() {
	const colorStops = new Map([
		[0, new Colour("red")],
		[0.5, Transparent],
		[1, new Colour("blue")]
	]);
	const p1 = new Vector2D(0, 0);
	return new RadialGradient(colorStops, p1, p1, 15, SpreadMethod.Pad);
};