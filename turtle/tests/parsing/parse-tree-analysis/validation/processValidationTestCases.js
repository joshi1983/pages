import { processValidationTestCase } from './processValidationTestCase.js';

export function processValidationTestCases(cases, logger, validateFunction) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array.  Not: ${cases}`);
	if (typeof validateFunction !== 'function')
		throw new Error('validateFunction must be a function.  Not: ' + validateFunction);
	if (typeof logger !== 'function')
		throw new Error('logger must be a function.  Not: ' + logger);
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateFunction);
	});
};