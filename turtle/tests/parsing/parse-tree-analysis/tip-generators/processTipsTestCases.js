import { processTipsTestCase } from './processTipsTestCase.js';

export function processTipsTestCases(cases, func, logger) {
	if (typeof func !== 'function')
		throw new Error(`func must be a function but got ${func}`);
	cases.forEach(function(caseInfo, index) {
		processTipsTestCase(caseInfo, func, logger, index);
	});
};