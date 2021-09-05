import { processTranslationTestCase } from './processTranslationTestCase.js';

export function processTranslationTestCases(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTranslationTestCase(caseInfo, logger);
	});
};