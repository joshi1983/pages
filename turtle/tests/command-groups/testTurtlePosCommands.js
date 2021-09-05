import { createTestTurtle } from '../helpers/createTestTurtle.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

function testXYZCommands(logger) {
	const turtle = createTestTurtle();
	turtle.setX(5);
	if (turtle.xCor() !== 5)
		logger('xCor expected to be 5 but is ' + turtle.xCor());
	turtle.setY(6);
	if (turtle.yCor() !== 6)
		logger('yCor expected to be 6 but is ' + turtle.yCor());
	turtle.setZ(7);
	if (turtle.zCor() !== 7)
		logger('zCor expected to be 7 but is ' + turtle.zCor());

	// check again in case setY or setZ updated x erroneously.
	if (turtle.xCor() !== 5)
		logger('After setZ(7), xCor expected to be 5 but is ' + turtle.xCor());
	// maybe the setZ updated y erroneously.
	if (turtle.yCor() !== 6)
		logger('After setZ(7), yCor expected to be 6 but is ' + turtle.yCor());

	turtle.setXY(1, 2);
	if (turtle.xCor() !== 1)
		logger('xCor expected to be 1 but is ' + turtle.xCor());
	if (turtle.yCor() !== 2)
		logger('yCor expected to be 2 but is ' + turtle.yCor());
	if (turtle.zCor() !== 7)
		logger('zCor expected to be 7 but is ' + turtle.zCor());

	turtle.setXYZ(9, 8, 7);
	if (turtle.xCor() !== 9)
		logger('xCor expected to be 9 but is ' + turtle.xCor());
	if (turtle.yCor() !== 8)
		logger('yCor expected to be 8 but is ' + turtle.yCor());
	if (turtle.zCor() !== 7)
		logger('zCor expected to be 7 but is ' + turtle.zCor());
}

function testRelativePositionCommands(logger) {
	const turtle = createTestTurtle();
	let result = turtle.distance([0, 0]);
	if (result !== 0)
		logger(`Expected distance([0, 0]) to be 0 but got ${result}`);
	result = turtle.distance([0, 0, 0]);
	if (result !== 0)
		logger(`Expected distance([0, 0, 0]) to be 0 but got ${result}`);
}

export function testTurtlePosCommands(logger) {
	wrapAndCall([
		testXYZCommands,
		testRelativePositionCommands
	], logger);
};