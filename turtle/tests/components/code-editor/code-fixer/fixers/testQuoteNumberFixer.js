import { processTestCase } from './processTestCase.js';
import { quoteNumberFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/quoteNumberFixer.js';

export function testQuoteNumberFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'fd "', 'logged': false},
		{'code': 'fd "hi', 'logged': false},
		{'code': 'fd "3.14', 'to': 'fd 3.14', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, quoteNumberFixer, logger);
	});
};