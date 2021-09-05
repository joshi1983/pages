import { createRadialEasingGradient } from './createRadialEasingGradient.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from '../../modules/drawing/vector/Vector2DDrawing.js';

export function createTestDrawingWithCustomEasing() {
	const settings = {'animationTime': 0};
	const result = new Vector2DDrawing();
	const turtle = new Turtle(settings, result);
	turtle.setFillGradient(createRadialEasingGradient());
	turtle.polyStart();
	turtle.arcLeft(30, 300);
	turtle.arcRight(12, 300);
	turtle.arcRight(228, 300);
	turtle.polyEnd();

	return result;
};