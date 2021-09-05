import { FastExecuter } from '../../../modules/set/animation-time/FastExecuter.js';
import { ProgressIndicator } from '../../helpers/ProgressIndicator.js';
import { VectorDrawing } from '../../../modules/drawing/vector/VectorDrawing.js';

export function testFastExecuter(logger) {
	const maxTime = 200;
	const code = 'fd 100';
	let isResolved = false;
	let drawingMade = false;
	const maxDelay = 120000;
	const executer = new FastExecuter(maxTime);
	const indicator = new ProgressIndicator('testFastExecuter');
	logger.indicators.push(indicator);
	indicator.setMessage('about to compile asyncronously');
	executer.compile(code).then(function() {
		isResolved = true;
		indicator.setProgressRatio(0.1);
		indicator.setMessage('about to get drawing');
		executer.getDrawing(0, 10).then(function(drawing) {
			indicator.setProgressRatio(0.75);
			indicator.setMessage('got drawing');
			if (!(drawing instanceof VectorDrawing))
				logger(`VectorDrawing expected but got ${drawing}`);
			else {
				const shapes = drawing.getShapesArray();
				if (shapes.length !== 1) {
					logger(`Expected to find 1 shape but got ${shapes.length}`);
				}
			}
			drawingMade = true;
			indicator.setProgressRatio(1);
			indicator.completed();
		});
		indicator.setProgressRatio(0.5);
	}).catch(function(errorDetails) {
		console.error(`errorDetails = `, errorDetails);
		logger(`compile failed with details: ${errorDetails}`);
		indicator.completed();
	});
	setTimeout(function() {
		if (!isResolved) {
			logger(`Expected FastExecuter compile to complete within ${maxDelay}ms but it did not.`);
		}
		else if (!drawingMade)
			logger(`Expected FastExecuter to getDrawing() within ${maxDelay}ms but did not get it.  Only the compile step was completed.`);
		indicator.completed();
	}, maxDelay);
};