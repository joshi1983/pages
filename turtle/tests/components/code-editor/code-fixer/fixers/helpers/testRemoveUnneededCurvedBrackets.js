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
		{'code': 'print (:i * 100)', 'to': 'print :i * 100', 'logged': true},
		{'code': 'print 1 / (:i * 100)', 'logged': false},
		{'code': `print ( word str :a '+' str :b '=' str :e )`, 'logged': false},
		{'code': 'print ( modulo 5 2 ) * 3', 'logged': false},
		{'code': 'print ( modulo 5 2 ) / 2', 'logged': false}
	];
	processTestCases(cases, removeUnneededCurvedBrackets, logger);
};