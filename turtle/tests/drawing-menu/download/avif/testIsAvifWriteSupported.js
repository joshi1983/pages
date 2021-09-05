import { isAvifWriteSupported } from
'../../../../modules/drawing-menu/download/avif/isAvifWriteSupported.js';
import { ProgressIndicator } from
'../../../helpers/ProgressIndicator.js';

export function testIsAvifWriteSupported(logger) {
	const result = isAvifWriteSupported();
	if (!(result instanceof Promise))
		logger(`Expected a Promise but got ${result}`);
	const progressIndicator = new ProgressIndicator('testIsAvifWriteSupported');
	progressIndicator.setMessage(`Waiting for result`);
	logger.indicators.push(progressIndicator);
	result.then(function(bool) {
		if (typeof bool !== 'boolean')
			logger(`Expected to resolve to a boolean but got ${bool}`);
		progressIndicator.setMessage(`Resolved to ${bool}`);
		progressIndicator.completed();
	});
}