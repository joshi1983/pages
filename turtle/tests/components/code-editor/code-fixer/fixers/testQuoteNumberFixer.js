import { processTestCases } from './processTestCases.js';
import { quoteNumberFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/quoteNumberFixer.js';

export function testQuoteNumberFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'fd "', 'logged': false},
		{'code': 'fd "hi', 'logged': false},
		{'code': 'fd "3.14', 'to': 'fd 3.14', 'logged': true},
	];
	processTestCases(cases, quoteNumberFixer, logger);
};