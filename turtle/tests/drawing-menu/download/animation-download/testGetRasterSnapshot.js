import { getRasterSnapshot } from '../../../../modules/drawing-menu/download/animation-download/getRasterSnapshot.js';
import { ProgressIndicator } from '../../../helpers/ProgressIndicator.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testGetRasterSnapshot(logger) {
	let isResolved = false;
	const program = testCodeToProgram('fd 100', logger);
	const indicator = new ProgressIndicator('testGetRasterSnapshot');
	logger.indicators.push(indicator);
	getRasterSnapshot(program, 500, 400, 1, 10).then(function(canvas) {
		indicator.setProgressRatio(0.1);
		indicator.setMessage('got snapshot');
		if (!(canvas instanceof HTMLCanvasElement)) {
			console.error('canvas = ', canvas);
			logger('The resolved canvas must be a HTMLCanvasElement.  Not: ' + canvas);
		}
		isResolved = true;
		indicator.completed();
	}).catch(function(e) {
		console.error(e);
		logger('Test failed with error message: ' + e);
		indicator.setMessage('error: ' + e);
		indicator.completed();
	});
	const maxTimeout = 60000;
	function checkResolved() {
		if (isResolved === false)
			logger(`Still unresolved after ${maxTimeout} milliseconds`);
		indicator.completed();
	}
	setTimeout(checkResolved, maxTimeout);
};