import { Turtle } from '../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../modules/drawing/vector/VectorDrawing.js';

export function createTestDrawing2() {
	const settings = {'animationTime': 0};
	const result = new VectorDrawing();
	const turtle = new Turtle(settings, result);
	turtle.polyStart();
	turtle.arcLeft(30, 300);
	turtle.arcRight(12, 300);
	turtle.arcRight(228, 300);
	turtle.polyEnd();

	return result;
};