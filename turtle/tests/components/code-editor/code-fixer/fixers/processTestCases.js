import { processTestCase } from './processTestCase.js';

/*
This uses tighter testing checks than processTestCase generally.
We want all fixer tests using this but some fixers don't update the WritableCachedParseTree correctly after making their changes.
Some tests use processTestCase only as a way to prevent automated tests from
giving error messages for problems that have been tentatively considered acceptable.
*/
export function processTestCases(cases, fixerFunction, logger) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but got ${cases}`);
	if (typeof fixerFunction !== 'function')
		throw new Error(`fixerFunction must be a function but got ${fixerFunction}`);
	if (typeof logger !== 'function') {
		console.error(`logger = `, logger);
		throw new Error(`logger must be a function but got ${logger}`);
	}
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, fixerFunction, logger);
	});
};