import { Colour } from '../../modules/Colour.js';
import { createTestTurtle } from '../helpers/createTestTurtle.js';
import { Gradient } from '../../modules/drawing/vector/shapes/gradients/Gradient.js';
import { isCloseEnough } from '../helpers/isCloseEnough.js';
import { LinearGradient } from '../../modules/drawing/vector/shapes/gradients/LinearGradient.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { SpreadMethod } from '../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Transparent } from '../../modules/Transparent.js';
import { valueToString } from '../../modules/valueToString.js';
import { Vector3D } from '../../modules/drawing/vector/Vector3D.js';

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

function testPenCommands(logger) {
	const turtle = createTestTurtle();
	turtle.setPenSize(5);
	if (turtle.penSize() !== 5)
		logger('penSize expected to be 5 but got ' + turtle.penSize());
	turtle.setPenColor(Transparent);
	if (turtle.penColor() !== Transparent)
		logger(`Expected to get penColor of Transparent but got ${turtle.penColor()}`);
	turtle.setPenColor(new Colour('#123'));
	if (!turtle.drawState.getPenColor().equals(new Colour('#123')))
		logger('penColor expected to be #123 but got ' + turtle.drawState.getPenColor());
	turtle.penUp();
	if (turtle.drawState.isPenDown !== false)
		logger('isPenDown expected to be false but got ' + turtle.drawState.isPenDown);
	turtle.forward(100);
	if (valueToString(turtle.pos()) !== '[0 100 0]')
		logger('pos expected to be [0 100 0] but got ' + valueToString(turtle.pos()));
	turtle.penNormal();
	if (turtle.penSize() !== 1)
		logger('after calling penNormal(), penSize expected to be 1 but got ' + turtle.penSize());
	if (!turtle.drawState.getPenColor().equals(new Colour('#000')))
		logger('after calling penNormal(), penColor expected to be #000 but got ' + turtle.penColor());
	if (turtle.drawState.isPenDown !== true)
		logger('after calling penNormal(), isPenDown expected to be true but got ' + turtle.drawState.isPenDown);
	if (valueToString(turtle.pos()) !== '[0 100 0]')
		logger('after penNormal, pos expected to remain at [0 100 0] but got ' + valueToString(turtle.pos()));
}

function testPosCommands(logger) {
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

export function testTurtle(logger) {
	testClearScreen(prefixWrapper('testClearScreen', logger));
	testForwardCommandEmpty(prefixWrapper('testForwardCommandEmpty', logger));
	testForwardCommand(prefixWrapper('testForwardCommand', logger));
	testGradient(prefixWrapper('testGradient', logger));
	testHeadingCommands(prefixWrapper('testHeadingCommands', logger));
	testPenCommands(prefixWrapper('testPenCommands', logger));
	testPosCommands(prefixWrapper('testPosCommands', logger));
	testSetColors(prefixWrapper('testSetColors', logger));
	testSetFillColor(prefixWrapper('testSetFillColor', logger));
};