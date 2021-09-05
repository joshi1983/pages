import { Colour } from '../../modules/Colour.js';
import { createTestTurtle } from './createTestTurtle.js';

export function createTestDrawingFromDimensions(width, height) {
	const turtle = createTestTurtle();
	if (height > width) {
		turtle.right(90);
		const temp = width;
		width = height;
		height = width;
	}
	const circleRadius = height / 2;
	const circleSeparation = width * 0.5 - circleRadius;
	turtle.setPenSize(0);
	turtle.setFillColor(new Colour('black'));
	turtle.jumpRight(circleSeparation);
	turtle.circle(circleRadius);
	turtle.jumpLeft(circleSeparation * 2);
	turtle.circle(circleRadius);
	return turtle.drawing;
};