import { asyncDownscale } from '../../../../modules/drawing/drawers/canvas/asyncDownscale.js';
import { ProgressIndicator } from '../../../helpers/ProgressIndicator.js';

export function testAsyncDownscale(logger) {
	const canvas = document.createElement('canvas');
	const indicator = new ProgressIndicator('testAsyncDownscale');
	logger.indicators.push(indicator);
	const result = asyncDownscale(2, canvas);
	if (!(result instanceof Promise)) {
		logger(`Expected a Promise but got ${result}`);
		indicator.setMessage('Failed to get promise');
		indicator.completed();
	}
	else {
		let isResolved = false;
		const maxDelay = 30000;
		indicator.setProgressRatio(0.1);
		indicator.setMessage('Got a Promise');
		result.then(function(responseData) {
			isResolved = true;
			if (!(responseData instanceof ImageData)) {
				logger(`Expected an instance of ImageData but got ${responseData}`);
				indicator.setMessage('Got the promise but it not contain ImageData');
			}
			else {
				indicator.setMessage('Got the promise and it contained ImageData.  All good.');
			}
			indicator.completed();
		});
		setTimeout(function() {
			if (isResolved !== true) {
				logger(`Expected to be resolved in ${maxDelay}ms but it is not`);
				indicator.setMessage('Took too long to resolve.');
				indicator.completed();
			}
		}, maxDelay);
	}
};