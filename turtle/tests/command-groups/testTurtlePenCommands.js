import { AlphaColour } from '../../modules/AlphaColour.js';
import { Colour } from '../../modules/Colour.js';
import { createTestTurtle } from '../helpers/createTestTurtle.js';
import { Transparent } from '../../modules/Transparent.js';
import { valueToString } from '../../modules/valueToString.js';

export function testTurtlePenCommands(logger) {
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

	const expectedPenColor = new AlphaColour('#8f00');
	turtle.setPenColor(expectedPenColor);
	if (!turtle.drawState.style.getPenColor() instanceof AlphaColour)
		logger(`Expected to get an AlphaColour but got ${turtle.drawState.style.getPenColor()}`);
	else if (turtle.drawState.style.getPenColor().equals(expectedPenColor) !== true)
		logger(`Expected to get ${expectedPenColor} but got ${turtle.drawState.style.getPenColor()}`);
};