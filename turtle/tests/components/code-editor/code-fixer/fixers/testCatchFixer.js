import { catchFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/catchFixer.js';
import { processTestCases } from './processTestCases.js';

/*
This is for a command like:
https://fmslogo.sourceforge.io/manual/command-catch.html
*/
export function testCatchFixer(logger) {
	const cases = [
		{'code': 'catch', 'logged': false},
		{'code': 'catch [', 'logged': false},
		{'code': 'catch []', 'logged': false},
		{'code': 'catch "hi', 'logged': false},
		{'code': 'catch 3', 'logged': false},
		{'code': 'catch "hi 4', 'logged': false},// second arg must be a list.
		{'code': 'catch "hi []', 'to': '  ', 'logged': true},
		{'code': 'catch "hi [print "yo]', 'to': '  print "yo', 'logged': true},
	];
	processTestCases(cases, catchFixer, logger);
};