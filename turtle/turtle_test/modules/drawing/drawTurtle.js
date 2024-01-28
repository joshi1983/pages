import { Colour } from '../Colour.js';
import { TurtleDrawState } from './TurtleDrawState.js';
await Colour.asyncInit();
const rootTwo = Math.sqrt(2);

function drawTurtleSize(turtleDrawState, size, colour) {
	const result = [];

	const cursor = new TurtleDrawState();
	cursor.setPosition(turtleDrawState.getPosition());
	cursor.setHeading(turtleDrawState.getHeading());
	cursor.right(Math.PI * 0.5);
	cursor.setPenColor(colour);
	cursor.forward(-size); // just to change position.
	result.push(cursor.forward(2*size));
	cursor.right(-Math.PI * 0.75);
	result.push(cursor.forward(size*rootTwo));
	cursor.right(-Math.PI * 0.5);
	result.push(cursor.forward(size*rootTwo));

	return result;
}

export function drawTurtle(turtleDrawState) {
	const size = 25;
	const shapes1 = drawTurtleSize(turtleDrawState, size, new Colour('#000'));
	turtleDrawState.forward(1);
	const shapes2 = drawTurtleSize(turtleDrawState, size * 0.9, turtleDrawState.getPenColor());
	return shapes1.concat(shapes2);
}