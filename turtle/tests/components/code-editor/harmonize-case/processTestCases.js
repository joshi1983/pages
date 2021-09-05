import { processTestCase } from './processTestCase.js';

export function processTestCases(cases, harmonizeFunc, logger) {
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, harmonizeFunc, logger);
	});
};