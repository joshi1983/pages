import { Turtle } from '../../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../../modules/drawing/vector/VectorDrawing.js';

export function createPrintCountTestTurtle() {
	const settings = {
		'animationTime': 0,
		'animationDurationSeconds': 10,
		'printCount': 0,
		'messages': [],
		'warn': function(msg) {
			console.log('warning: ' + msg);
		},
		'print': function(msg) {
			settings.messages.push('' + msg);
			settings.printCount++;
		}
	};
	const drawing = new VectorDrawing();
	drawing.setDimensions(100, 100);
	const turtle = new Turtle(settings, drawing);
	return {'turtle': turtle, 'settings': settings};
};