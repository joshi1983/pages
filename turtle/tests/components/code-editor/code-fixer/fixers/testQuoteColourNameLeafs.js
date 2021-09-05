import { processTestCase } from './processTestCase.js';
import { quoteColourNameLeafs } from '../../../../../modules/components/code-editor/code-fixer/fixers/quoteColourNameLeafs.js';

export function testQuoteColourNameLeafs(logger) {
	const cases = [
		{'code': '', 'to': '', 'logged': false},
		{'code': 'to red\nend', 'to': 'to red\nend', 'logged': false},
		{'code': 'setPenColor red', 'to': 'setPenColor "red', 'logged': true},
	];
	cases.forEach(function(caseInfo) {
		processTestCase(caseInfo, quoteColourNameLeafs, logger);
	});
};