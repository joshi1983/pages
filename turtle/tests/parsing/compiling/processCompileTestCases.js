import { processCompileTestCase } from './processCompileTestCase.js';

export function processCompileTestCases(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		processCompileTestCase(caseInfo, index, logger);
	});
};