import { Turtle } from '../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from '../../modules/drawing/vector/Vector2DDrawing.js';

export function createTestTurtle(optionalSettings) {
	const settings = {
		'animationDurationSeconds': 10,
		'animationTime': 0,
		'warn': function(msg) {
			console.log('warning: ' + msg);
		}
	};
	if (typeof optionalSettings === 'object')
		Object.assign(settings, optionalSettings);
	const drawing = new Vector2DDrawing();
	const turtle = new Turtle(settings, drawing);

	return turtle;
}