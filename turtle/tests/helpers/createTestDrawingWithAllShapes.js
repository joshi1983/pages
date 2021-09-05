import { createRadialGradient } from './createRadialGradient.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../modules/drawing/vector/VectorDrawing.js';

export function createTestDrawingWithAllShapes() {
	const settings = {'animationTime': 0};
	const result = new VectorDrawing();
	const turtle = new Turtle(settings, result);
	turtle.circle(1); // should produce a CircleShape.
	turtle.rollRight(30);
	turtle.jumpForward(10);
	turtle.sphere(5);
	turtle.pitchUp(50);
	turtle.polyStart();
	turtle.jumpForward(10);
	turtle.right(30);
	turtle.jumpForward(10);
	turtle.arcLeft(30, 300);
	turtle.polyEnd();
	turtle.setFillGradient(createRadialGradient());
	turtle.forward(30);
	turtle.ellipse(10, 20);
	turtle.arcLeft(90, 5);
	turtle.ellipseArc(90, 20, 10, 0);
	turtle.label('hello');
	turtle.circle(2); // should produce an OrientedCircleShape
	return result;
};