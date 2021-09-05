import { createTestTurtle } from '../helpers/createTestTurtle.js';

export function testTurtleLineCommands(logger) {
	const turtle = createTestTurtle();
	let result = turtle.lineCap();
	if (result !== 'butt')
		logger(`Expected lineCap to initially be butt but got ${result}`);
	result = turtle.lineJoinStyle();
	if (result !== 'miter')
		logger(`Expected lineJoinStyle to initially be miter but got ${result}`);
};