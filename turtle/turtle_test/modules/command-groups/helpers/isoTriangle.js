import { MathCommands } from '../MathCommands.js';

/*
The equivalent WebLogo code is:
	localmake "oldState turtleState
	localmake "angle arcTan :height / (:width / 2)
	jumpRight :width / 2
	polyStart
	jumpLeft :width
	right 90 - :angle
	jumpForward :height / sin :angle
	polyEnd
	setTurtleState :oldState
*/
export function isoTriangle(turtle, width, height) {
	if (width <= 0)
		throw new Error(`width must be greater than 0 but got ${width}`);
	const oldPos = turtle.pos();
	const oldHeading = turtle.heading();
	const angleRadians = Math.atan(height / (width / 2));
	turtle.jumpRight(width / 2);
	turtle.polyStart();
	turtle.jumpLeft(width);
	turtle.right(90 - angleRadians / MathCommands.degToRadianScale);
	turtle.jumpForward(height / Math.sin(angleRadians));
	turtle.polyEnd();

	// restore previous state of turtle.
	turtle.setHeading(oldHeading);
	turtle.jumpTo(oldPos);
};