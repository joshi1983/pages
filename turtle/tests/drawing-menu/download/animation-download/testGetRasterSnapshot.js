import { getRasterSnapshot } from '../../../../modules/drawing-menu/download/animation-download/getRasterSnapshot.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testGetRasterSnapshot(logger) {
	let isResolved = false;
	const program = testCodeToProgram('fd 100', logger);
	getRasterSnapshot(program, 500, 400, 1, 10).then(function(canvas) {
		if (!(canvas instanceof HTMLCanvasElement)) {
			console.error('canvas = ', canvas);
			logger('The resolved canvas must be a HTMLCanvasElement.  Not: ' + canvas);
		}
		isResolved = true;
	}).catch(function(e) {
		console.error(e);
		logger('Test failed with error message: ' + e);
	});
	function checkResolved() {
		if (isResolved === false)
			logger('Still unresolved after 5000 milliseconds');
	}
	setTimeout(checkResolved, 5000);
};