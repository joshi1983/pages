import { penWidthCallWithValueFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/penWidthCallWithValueFixer.js';
import { processTestCases } from './processTestCases.js';

/*
This is for fixing code used by a Logo programming environment called Papert.

Some examples can be found at:
https://www.reddit.com/r/programming/comments/73le2/papert_inbrowser_logo_implementation/
*/
export function testPenWidthCallWithValueFixer(logger) {
	const cases = [
		{'code': 'penwidth', 'logged': false},
		{'code': 'penwidth []', 'logged': false},
		{'code': 'penwidth 4', 'to': 'setPenSize 4', 'logged': true},
		{'code': 'penwidth 4 + 5', 'to': 'setPenSize 4 + 5', 'logged': true},
		{'code': 'penwidth (4 + 5)', 'to': 'setPenSize (4 + 5)', 'logged': true},
		{'code': 'penwidth -4 + 5', 'to': 'setPenSize -4 + 5', 'logged': true},
		{'code': 'penwidth -(4 + 5)', 'to': 'setPenSize -(4 + 5)', 'logged': true},
		{'code': 'penwidth :x', 'to': 'setPenSize :x', 'logged': true},
	];
	processTestCases(cases, penWidthCallWithValueFixer, logger);
};