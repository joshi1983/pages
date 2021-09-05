import { processTestCases } from './processTestCases.js';
import { requiredColourNameLongStringFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/requiredColourNameLongStringFixer.js';

export function testRequiredColourNameLongStringFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print \'Alice Blue\'', 'logged': false},
		{'code': 'setPenColor \'red\'', 'logged': false},
		{'code': 'setPenColor \'lightgreen\'', 'logged': false},
		{'code': 'setPenColor \'light green\'', 'to': 'setPenColor  "lightgreen', 'logged': true},
		{'code': 'setPenColor \'Alice Blue\'', 'to': 'setPenColor  "AliceBlue', 'logged': true},
	];
	processTestCases(cases, requiredColourNameLongStringFixer, logger);

};