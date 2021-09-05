import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../../modules/Colour.js';
import { createTestTurtle } from '../../../helpers/createTestTurtle.js';

export function testCreateFilledCircleUsingCircleLeft(logger) {
	const turtle = createTestTurtle();
	const expected = new Colour('red');
	turtle.setFillColor(new Colour('red'));
	turtle.circleLeft(100);
	const drawing = turtle.drawing;
	const shapes = drawing.getShapesArray();
	if (shapes.length === 0)
		logger(`Expected shapes.length to be at least 1 but got ${shapes.length}`);
	else {
		const circle = shapes.filter(s => s instanceof CircleShape)[0];
		if (!(circle instanceof CircleShape))
			logger(`Expected a shape to be a CircleShape but got ${circle}`);
		else {
			const fillColour = circle.style.getFillColor();
			if (!fillColour.equals(expected))
				logger(`Expected fillColor to be ${expected} but got ${fillColour}`);
		}
	}
};