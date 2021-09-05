import { Colour } from '../../modules/Colour.js';
import { EaseInOut } from '../../modules/drawing/vector/easing/EaseInOut.js';
import { RadialGradient } from '../../modules/drawing/vector/shapes/gradients/RadialGradient.js';
import { SpreadMethod } from '../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Vector2D } from '../../modules/drawing/vector/Vector2D.js';

export function createRadialEasingGradient() {
	const colorStops = new Map([
		[0, new Colour("red")],
		[1, [new Colour("blue"), new EaseInOut()]]
	]);
	const p1 = new Vector2D(0, 0);
	return new RadialGradient(colorStops, p1, p1, 15, SpreadMethod.Pad);
};