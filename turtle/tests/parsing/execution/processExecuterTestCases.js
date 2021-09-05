import { processExecuterTestCase } from './processExecuterTestCase.js';

export function processExecuterTestCases(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		processExecuterTestCase(caseInfo, index, logger);
	});
};