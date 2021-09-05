import { ProcessingMethod } from
'../../../modules/parsing/processing/ProcessingMethod.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

function basicTest(logger) {
	const info = ProcessingMethod.getMethodInfo('rect', null, 4);
	if (typeof info !== 'object')
		logger(`Expected an object but got ${info}`);
	else {
		if (typeof info.name !== 'string')
			logger(`Expected name to be a string but got ${info.name}`);
		if (info.className !== null)
			logger(`Expected className to be null but got ${info.className}`);
	}
}

function strTest(logger) {
	const info = ProcessingMethod.getMethodInfo('str', null, 1, ['boolean']);
	if (typeof info === 'object') {
		if (info.name !== 'str')
			logger(`Expected name to be str but got ${info.name}`);
		else if (info.toProc !== 'pStr')
			logger(`Expected toProc to be pStr but got ${info.toProc}`);
	}
}

export function testProcessingMethod(logger) {
	wrapAndCall([
		basicTest,
		strTest
	], logger);
};