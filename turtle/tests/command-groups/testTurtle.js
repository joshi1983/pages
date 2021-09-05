import { Colour } from '../../modules/Colour.js';
import { createTestTurtle } from '../helpers/createTestTurtle.js';
import { Gradient } from '../../modules/drawing/vector/shapes/gradients/Gradient.js';
import { isCloseEnough } from '../helpers/isCloseEnough.js';
import { LinearGradient } from '../../modules/drawing/vector/shapes/gradients/LinearGradient.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { SpreadMethod } from '../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Transparent } from '../../modules/Transparent.js';
import { Vector3D } from '../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

function testClearScreen(logger) {
	const turtle = createTestTurtle();
	turtle.setHeading(45);
	turtle.forward(100);
	turtle.setHeading(30);
	turtle.clearScreen();
	if (turtle.heading() !== 0)
		logger('turtle heading expected to be 0 after clearScreen command but got ' + turtle.heading());
	if (JSON.stringify(turtle.pos()) !== '[0,0,0]')
		logger('turtle pos() expected to return [0,0,0] after clearScreen but got ' + JSON.stringify(turtle.pos()));
}

function testForwardCommand(logger) {
	const turtle = createTestTurtle();
	turtle.forward(90);
	let pos = turtle.pos();
	if (!isCloseEnough(pos[0], 0))
		logger('After forward 90, x position expected to be 0 but got ' + pos[0]);
	if (!isCloseEnough(pos[1], 90))
		logger('After forward 90, y position expected to be 90 but got ' + pos[1]);
	if (!isCloseEnough(pos[2], 0))
		logger('After forward 90, z position expected to be 0 but got ' + pos[2]);
	if (turtle.heading() !== 0)
		logger('Expected heading to be 0 but got ' + turtle.heading());
	turtle.right(90);
	if (turtle.heading() !== 90)
		logger('Expected heading to be 90 but got ' + turtle.heading());
	turtle.forward(100);
	pos = turtle.pos();
	if (!isCloseEnough(pos[0], 100))
		logger('pos x expected to 100 but got ' + pos[0]);
	if (!isCloseEnough(pos[1], 90))
		logger('pos x expected to 90 but got ' + pos[1]);
	if (!isCloseEnough(pos[2], 0))
		logger('pos x expected to 100 but got ' + pos[2]);
}

function testForwardCommandEmpty(logger) {
	const turtle = createTestTurtle();
	turtle.forward(0); // test a weird case.
	turtle.forward(-0); // test weird cases.
}

function testHeadingCommands(logger) {
	const turtle = createTestTurtle();
	if (turtle.heading() !== 0)
		logger('Heading expected to be 0 initially but got ' + turtle.heading());
	turtle.setHeading(360);
	if (turtle.heading() !== 0)
		logger('After setHeading(360), heading() expected to return 0 but got ' + turtle.heading());
	turtle.setHeading(-100);
	if (turtle.heading() !== 260)
		logger('After setHeading(-100), heading() expected to return 260 but got ' + turtle.heading());
	turtle.setHeading(0.5);
	if (turtle.heading() !== 0.5)
		logger('heading expected to be 0.5 but got ' + turtle.heading());
	turtle.setHeading(0);
	if (turtle.heading() !== 0)
		logger('heading expected to be 0 but got ' + turtle.heading());
	turtle.right(180);
	if (turtle.heading() !== 180)
		logger('heading expected to be 180 but got ' + turtle.heading());
	turtle.right(180);
	if (turtle.heading() !== 0)
		logger('heading expected to be 0 after turning right 180 twice but got ' + turtle.heading());
}

function testGradient(logger) {
	const turtle = createTestTurtle();
	const spreadMethods = ['pad', 'reflect', 'repeat'].map(key => SpreadMethod.parse(key));
	let colorStops = new Map([
		[0, "red"],
		[0.5, [0, 0, 0]],
		[1, "blue"],
	]);
	colorStops = Gradient.sanitizeColorStops(colorStops);
	const froms = [[0, 0], [50, 50], [0, 0, 0], [50, 50, 0]].map(coords => new Vector3D(coords));
	const to = new Vector3D([100, 100, 0]);
	froms.forEach(function(from) {
		spreadMethods.forEach(function(spreadMethod) {
			const gradient = new LinearGradient(colorStops, from, to, spreadMethod);
			turtle.setFillGradient(gradient);
		});
	});
}

function testSetColors(logger) {
	const turtle = createTestTurtle();
	turtle.setFillColor(new Colour('red'));
	turtle.setPenColor(new Colour('blue'));
	turtle.setColors(Transparent);
	if (turtle.fillColor() !== Transparent)
		logger(`Expected to get Transparent object but got ${turtle.fillColor()}`);
	if (turtle.penColor() !== Transparent)
		logger(`Expected to get Transparent object but got ${turtle.penColor()}`);
}

function testSetFillColor(logger) {
	const turtle = createTestTurtle();
	const originalScreenColor = turtle.screenColor().toString();
	turtle.setFillColor(new Colour("black"));
	if (turtle.screenColor().toString() !== originalScreenColor)
		logger(`screen color expected to be ${originalScreenColor} but got ${turtle.screenColor()}`);
	turtle.setFillColor(Transparent);
	if (turtle.fillColor() !== Transparent)
		logger(`Expected to get Transparent object but got ${turtle.fillColor()}`);
}

function testGetArcLeftAngleToCircle(logger) {
	const turtle = createTestTurtle();
	const numIterations = 100;
	turtle.jumpForward(50.05);
	const center = turtle.pos();
	const largeRadius = 50.3;
	const expectedResult = 12.55;
	const errorTolerance = 0.01;
	const radius = 11;
	for (let i = 0; i < numIterations; i++) {
		const angle = 360 * i / numIterations;
		turtle.jumpTo(center);
		turtle.setHeading(angle);
		turtle.jumpBackward(largeRadius);
		turtle.right(90);
		const circlePosition = turtle.pos();
		const result = turtle.getArcLeftAngleToCircle(largeRadius, circlePosition, radius);
		if (Math.abs(result - expectedResult) > errorTolerance) {
			const plogger = prefixWrapper(`i=${i}, angle=${angle}`, logger);
			if (result < expectedResult - errorTolerance)
				plogger(`Expected a positive number roughly ${expectedResult} but found ${result}`);
			else if (result > expectedResult + errorTolerance)
				plogger(`Expected roughly ${expectedResult} but found ${result}`);
		}
	}
}

export function testTurtle(logger) {
	wrapAndCall([
		testClearScreen,
		testForwardCommandEmpty,
		testForwardCommand,
		testGetArcLeftAngleToCircle,
		testGradient,
		testHeadingCommands,
		testSetColors,
		testSetFillColor
	], logger);
};