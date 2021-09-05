import { Turtle } from '../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../modules/drawing/vector/VectorDrawing.js';

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
	const drawing = new VectorDrawing();
	const turtle = new Turtle(settings, drawing);

	return turtle;
}