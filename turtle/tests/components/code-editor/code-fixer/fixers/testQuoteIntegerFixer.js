import { processTestCases } from './processTestCases.js';
import { quoteIntegerFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/quoteIntegerFixer.js';

export function testQuoteIntegerFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'setPenColor 4', 'logged': false},
		{'code': 'setPenColor "4', 'to': 'setPenColor 4', 'logged': true},
		{'code': 'setFillColor "4', 'to': 'setFillColor 4', 'logged': true},
		{'code': 'fd "', 'logged': false},
	];
	processTestCases(cases, quoteIntegerFixer, logger);
};