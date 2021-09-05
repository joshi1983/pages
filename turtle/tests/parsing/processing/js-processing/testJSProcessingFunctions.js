import { JSProcessingFunctions } from
'../../../../../modules/parsing/processing/js-processing/JSProcessingFunctions.js';

export function testJSProcessingFunctions(logger) {
	const circleInfo = JSProcessingFunctions.getFunctionInfo('circle');
	if (!(circleInfo instanceof Array))
		logger(`Expected an Array but found ${circleInfo}`);
};