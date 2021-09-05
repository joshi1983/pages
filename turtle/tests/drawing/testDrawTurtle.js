import { drawTurtle } from '../../modules/drawing/drawTurtle.js';
import { Shape } from '../../modules/drawing/vector/shapes/Shape.js';
import { TurtleDrawState } from '../../modules/drawing/TurtleDrawState.js';

export function testDrawTurtle(logger) {
	const turtleCursorDrawingShapes = drawTurtle(new TurtleDrawState());
	if (!(turtleCursorDrawingShapes instanceof Array))
		logger('An Array expected but got ' + turtleCursorDrawingShapes);
	else {
		if (turtleCursorDrawingShapes.length < 3)
			logger('At least 3 shapes expected but got ' + turtleCursorDrawingShapes.length);
		turtleCursorDrawingShapes.forEach(function(shape) {
			if (!(shape instanceof Shape))
				logger('Every element of the returned Array should be a Shape but got ' + shape);
		});
	}
};