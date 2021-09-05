import { FastExecuter } from '../../../modules/set/animation-time/FastExecuter.js';
import { Vector2DDrawing } from '../../../modules/drawing/vector/Vector2DDrawing.js';

export function testFastExecuter(logger) {
	const maxTime = 200;
	const code = 'fd 100';
	let isResolved = false;
	let drawingMade = false;
	const maxDelay = 10000;
	const executer = new FastExecuter(code, maxTime);
	executer.compile().then(function() {
		isResolved = true;
		executer.getDrawing(0, 10).then(function(drawing) {
			if (!(drawing instanceof Vector2DDrawing))
				logger(`Vector2DDrawing expected but got ${drawing}`);
			else {
				const shapes = drawing.getShapesArray();
				if (shapes.length !== 1) {
					logger(`Expected to find 1 shape but got ${shapes.length}`);
				}
			}
			drawingMade = true;
		});
	});
	setTimeout(function() {
		if (!isResolved) {
			logger(`Expected FastExecuter compile to complete within ${maxDelay}ms but it did not.`);
		}
		else if (!drawingMade)
			logger(`Expected FastExecuter to getDrawing() within ${maxDelay}ms but did not get it.  Only the compile step was completed.`);
	}, maxDelay);
};