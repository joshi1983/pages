import { Colour } from '../Colour.js';
import { LineJoinStyle } from './vector/shapes/style/LineJoinStyle.js';
import { TurtleDrawState } from './TurtleDrawState.js';
await Colour.asyncInit();
const rootTwo = Math.sqrt(2);
const black = new Colour('#000');
const white = new Colour('#fff');

function drawTurtleSize(turtleDrawState, size, colour, thickness) {
	const result = [];

	const cursor = new TurtleDrawState();
	cursor.style.setLineJoinStyle(LineJoinStyle.Miter);
	cursor.setPenWidth(thickness);
	cursor.setPosition(turtleDrawState.getPosition());
	cursor.setHeading(turtleDrawState.getHeading());
	cursor.jumpRight(size);
	cursor.setPenColor(colour);
	cursor.right(-Math.PI * 0.25);
	const points = [cursor.getPosition().coords.slice()];
	cursor.jumpForward(size * rootTwo);
	points.push(cursor.getPosition().coords.slice());
	cursor.right(-Math.PI * 0.5);
	cursor.jumpForward(size * rootTwo);
	points.push(cursor.getPosition().coords.slice());
	result.push(cursor.getPolygon(points));
	return result;
}

export function drawTurtle(turtleDrawState) {
	const originalSize = 25;
	const thickness = originalSize / 12;
	const thickness2 = thickness / 2;
	const sizeStep = thickness2 * (1 + rootTwo);
	let size = originalSize;
	/*
	We are drawing both white and black lines to ensure that the turtle is always visible.
	If we drew with only black and the turtle happened to be over a black background and have a black pen,
	the turtle would be completely invisible.  
	Using some very opposite colours every time the turtle is drawn guarantees that it is visible.
	*/
	const shapes1 = drawTurtleSize(turtleDrawState, size, white, thickness);
	turtleDrawState.jumpForward(thickness2);
	size -= sizeStep;
	const shapes2 = drawTurtleSize(turtleDrawState, size, black, thickness);
	size -= sizeStep;
	turtleDrawState.jumpForward(thickness2);
	const shapes3 = drawTurtleSize(turtleDrawState, size, turtleDrawState.getPenColor(), thickness);
	return shapes1.concat(shapes2).concat(shapes3);
}