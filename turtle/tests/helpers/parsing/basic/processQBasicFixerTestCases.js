import { processQBasicFixerTestCase } from './processQBasicFixerTestCase.js';

/*
Similar to components/code-editor/code-fixer/fixers/processTestCases.js
except processQBasicFixerTestCases is for QBasic parse trees.
components/code-editor...processTestCases.js is for WebLogo's parse trees.

*/
export function processQBasicFixerTestCases(cases, fixerFunction, logger) {
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
		processQBasicFixerTestCase(caseInfo, fixerFunction, logger);
	});
};