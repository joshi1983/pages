import { commaFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/commaFixer.js';
import { processTestCases } from './processTestCases.js';

export function testCommaFixer(logger) {
	const cases = [
		{'code': 'print [1 2]', 'logged': false},
		{'code': 'print [1, 2]', 'to': 'print [1 2]', 'logged': true},
		{'code': 'print [1,]', 'to': 'print [1]', 'logged': true},
		{'code': 'print [1,2]', 'to': 'print [1 2]', 'logged': true},
		{'code': 'print [1.0,2]', 'to': 'print [1.0 2]', 'logged': true},
		{'code': 'print [1.0,2.00]', 'to': 'print [1.0 2.00]', 'logged': true},
		// test that the .0 and .00 aren't lost somehow.
		// NUMBER_LITERAL tokens have a number val.
		// If originalString or other string representations don't persist,
		// the original decimals could get lost while performing the fix and 
		// you get output more like print [1 2].
		{'code': 'print [,1.0,2.00,]', 'to': 'print [1.0 2.00]', 'logged': true},
		{'code': 'print [,1.0,2.00,3.0]', 'to': 'print [1.0 2.00 3.0]', 'logged': true},
		{'code': 'print [,1.0,2.00,3.0,]', 'to': 'print [1.0 2.00 3.0]', 'logged': true},

		{'code': 'print [1,2,]', 'to': 'print [1 2]', 'logged': true},
		{'code': 'print [1,,2]', 'to': 'print [1 2]', 'logged': true},
		{'code': 'print [1,,,2]', 'to': 'print [1 2]', 'logged': true},
		{'code': 'print [1, 2, 3]', 'to': 'print [1 2 3]', 'logged': true},
		{'code': 'print [1,,2,,,,3]', 'to': 'print [1 2 3]', 'logged': true},
		{'code': 'print [1,2,3]', 'to': 'print [1 2 3]', 'logged': true},
		{'code': 'print ["Hello, "world]', 'logged': false},
		{'code': 'print [,]', 'to': 'print []', 'logged': true},
	];
	processTestCases(cases, commaFixer, logger);
};