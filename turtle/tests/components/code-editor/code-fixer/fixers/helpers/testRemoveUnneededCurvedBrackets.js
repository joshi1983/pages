import { removeUnneededCurvedBrackets } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';
import { processTestCases } from '../processTestCases.js';

export function testRemoveUnneededCurvedBrackets(logger) {
	const cases = [
		{'code': 'print 2 * ( :y + 3 )', 'logged': false},
		{'code': 'print ( :y + 3 ) * 2', 'logged': false},
		// removing brackets in the above 2 cases would change order of operation.
		// For this reason, the brackets are needed.

		{'code': 'print (1)', 'to': 'print 1', 'logged': true},
		{'code': 'print (:x)', 'to': 'print :x', 'logged': true},
		{'code': 'print (i)', 'to': 'print i', 'logged': true},
	];
	processTestCases(cases, removeUnneededCurvedBrackets, logger);
};