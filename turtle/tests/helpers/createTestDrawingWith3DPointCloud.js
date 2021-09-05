import { createRadialGradient } from './createRadialGradient.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../modules/drawing/vector/VectorDrawing.js';

export function createTestDrawingWith3DPointCloud() {
	const settings = {'animationTime': 0};
	const result = new VectorDrawing();
	const turtle = new Turtle(settings, result);
	turtle.polyStart();
	turtle.jumpForward(10);
	turtle.arcLeft(30, 300);
	turtle.arcRight(12, 300);
	turtle.arcRight(228, 300);
	turtle.jumpForward(5);
	turtle.polyEnd();
	turtle.jumpTo([1, 2, 3]);
	turtle.circle(1);
	turtle.jumpTo([1, -2, -3]);
	turtle.setFillGradient(createRadialGradient());
	turtle.setPenSize(0);
	turtle.circle(1);

	return result;
};