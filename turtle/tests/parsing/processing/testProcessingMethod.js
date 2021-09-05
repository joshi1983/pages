import { ProcessingMethod } from
'../../../modules/parsing/processing/ProcessingMethod.js';

export function testProcessingMethod(logger) {
	const info = ProcessingMethod.getMethodInfo('rect', null, 4);
	if (typeof info !== 'object')
		logger(`Expected an object but got ${info}`);
	else {
		if (typeof info.name !== 'string')
			logger(`Expected name to be a string but got ${info.name}`);
		if (info.className !== null)
			logger(`Expected className to be null but got ${info.className}`);
	}
};