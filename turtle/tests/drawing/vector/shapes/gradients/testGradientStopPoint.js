import { Colour } from '../../../../../modules/Colour.js';
import { EaseEase } from '../../../../../modules/drawing/vector/easing/EaseEase.js';
import { GradientStopPoint } from '../../../../../modules/drawing/vector/shapes/gradients/GradientStopPoint.js';

export function testGradientStopPoint(logger) {
	const colour = new Colour('red');
	const easing = new EaseEase();
	new GradientStopPoint(colour, easing);
};