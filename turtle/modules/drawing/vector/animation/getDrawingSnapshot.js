import { LogoProgramExecuter } from '../../../parsing/execution/LogoProgramExecuter.js';
import { Turtle } from '../../../command-groups/Turtle.js';
import { VectorDrawing } from '../VectorDrawing.js';

export function getDrawingSnapshot(program, animationTimeSeconds, animationDuration) {
	if (typeof animationDuration !== 'number' || animationDuration <= 0)
		throw new Error('animationDuration must be a number and must be positive.  animationDuration=' + animationDuration);

	const settings = {
		'animationDurationSeconds': animationDuration,
		'animationTime': animationTimeSeconds
	};
	const drawing = new VectorDrawing();
	const turtle = new Turtle(settings, drawing);
	const executer = new LogoProgramExecuter(turtle, program);

	function freeAll() {
		executer.removeAllEventListeners();
		drawing.removeAllEventListeners();
	}

	return new Promise(function(resolve, reject) {
		executer.addEventListener('execution-stopped', function() {
			resolve(drawing);
			freeAll();
		});
		executer.addEventListener('exception', function(event) {
			reject(event.details);
			freeAll();
		});
		executer.startContinuousExecution();
	});
}