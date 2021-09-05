import { processTestCase } from './processTestCase.js';
import { quoteNumberFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/quoteNumberFixer.js';

export function testQuoteNumberFixer(logger) {
	const cases = [
		{'code': '', 'to': '', 'logged': false},
		{'code': 'fd "', 'to': 'fd "', 'logged': false},
		{'code': 'fd "hi', 'to': 'fd "hi', 'logged': false},
		{'code': 'fd "3.14', 'to': 'fd 3.14', 'logged': true},
	];
	cases.forEach(function(caseInfo) {
		processTestCase(caseInfo, quoteNumberFixer, logger);
	});
};