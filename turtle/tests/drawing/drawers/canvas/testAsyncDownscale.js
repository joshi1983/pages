import { asyncDownscale } from '../../../../modules/drawing/drawers/canvas/asyncDownscale.js';

export function testAsyncDownscale(logger) {
	const canvas = document.createElement('canvas');
	const result = asyncDownscale(2, canvas);
	if (!(result instanceof Promise))
		logger(`Expected a Promise but got ${result}`);
	else {
		let isResolved = false;
		const maxDelay = 30000;
		result.then(function(responseData) {
			isResolved = true;
			if (!(responseData instanceof ImageData))
				logger(`Expected an instance of ImageData but got ${responseData}`);
		});
		setTimeout(function() {
			if (isResolved !== true) {
				logger(`Expected to be resolved in ${maxDelay}ms but it is not`);
			}
		}, maxDelay);
	}
};