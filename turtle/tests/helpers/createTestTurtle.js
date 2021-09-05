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
	let drawing;
	if (typeof optionalSettings === 'object') {
		Object.assign(settings, optionalSettings);
		drawing = optionalSettings.drawing;
	}
	if (drawing === undefined)
		drawing = new VectorDrawing();
	const turtle = new Turtle(settings, drawing);

	return turtle;
}