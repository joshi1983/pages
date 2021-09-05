import { createRadialEasingGradient } from './createRadialEasingGradient.js';
import { createRadialEasingSemitransparentGradient } from './createRadialEasingSemitransparentGradient.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../modules/drawing/vector/VectorDrawing.js';

export function createTestDrawingWithCustomEasing() {
	const settings = {'animationTime': 0};
	const result = new VectorDrawing();
	const turtle = new Turtle(settings, result);
	turtle.setFillGradient(createRadialEasingGradient());
	turtle.polyStart();
	turtle.arcLeft(30, 300);
	turtle.arcRight(12, 300);
	turtle.arcRight(228, 300);
	turtle.polyEnd();

	turtle.setFillGradient(createRadialEasingSemitransparentGradient());
	turtle.jumpTo([100, 100]);
	turtle.circle(100);

	return result;
};