import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { processTestCase } from './processTestCase.js';

export function processTestCases(cases, logger, dataType) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, s=${caseInfo.s}`, logger);
		processTestCase(caseInfo, plogger, dataType);
	});
};