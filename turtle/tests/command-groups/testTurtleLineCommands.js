import { createTestTurtle } from '../helpers/createTestTurtle.js';

export function testTurtleLineCommands(logger) {
	const turtle = createTestTurtle();
	let result = turtle.lineCap();
	if (result !== 'round')
		logger(`Expected lineCap to initially be round but got ${result}`);
	result = turtle.lineJoinStyle();
	if (result !== 'miter')
		logger(`Expected lineJoinStyle to initially be miter but got ${result}`);
};