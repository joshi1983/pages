import { polishNotationFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/polishNotationFixer.js';
import { processTestCases } from './processTestCases.js';

/*
The polishNotationFixer is to fix some differences between WebLogo 
and some other Logo interpreters with respect to Polish notation.

Some examples of another Logo interpreter's supported
Polish notation operators are shown at:
https://archive.org/details/amiga-logo-manual/page/n29/mode/2up
*/
export function testPolishNotationFixer(logger) {
	const cases = [
		{'code': 'print 3 + 4', 'logged': false},
		{'code': 'print (3 + 4)', 'logged': false},
		{'code': 'print (-4)', 'logged': false},
		{'code': 'print (+ 1+2)', 'logged': false},
		{'code': 'print (+ 1)', 'logged': false},
		{'code': 'print (+ 3 4)', 'to': 'print (3 + 4)', 'logged': true},
		{'code': 'print (+ :x :y)', 'to': 'print (:x + :y)', 'logged': true},
		{'code': 'print (+ :x*2 4)', 'to': 'print ( :x*2+ 4)', 'logged': true},
		{'code': 'print (+ 3 4 5)', 'to': 'print (sum 3 4 5)', 'logged': true},
		{'code': 'print (* 3 4 5)', 'to': 'print (product 3 4 5)', 'logged': true},
	];
	processTestCases(cases, polishNotationFixer, logger);
};