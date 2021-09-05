import { CircleShape } from
'../../../modules/drawing/vector/shapes/CircleShape.js';
import { EllipseShape } from
'../../../modules/drawing/vector/shapes/EllipseShape.js';
import { createTestTurtle } from
'../../helpers/createTestTurtle.js';
import { processPenUpStyle } from
'../../../modules/drawing/turtle-draw-state/processPenUpStyle.js';
import { Vector3D } from
'../../../modules/drawing/vector/Vector3D.js';

export function testProcessPenUpStyle(logger) {
	const position = new Vector3D();
	const shapes = [new CircleShape(position, 100), new EllipseShape(position, 0, 100, 200)];
	for (const shape of shapes) {
		const turtle = createTestTurtle();
		shape.style.setPenWidth(1);
		turtle.penUp();
		processPenUpStyle(turtle.drawState, shape);
		if (shape.style.isPenVisible())
			logger(`Expected shape's pen to not be visible but isPenVisible returned true`);
		turtle.penDown();
		shape.style.setPenWidth(1);
		processPenUpStyle(turtle.drawState, shape);
		if (!shape.style.isPenVisible())
			logger(`Expected shape's pen to be visible but isPenVisible returned false`);
	}
};