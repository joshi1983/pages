import { commaFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/commaFixer.js';
import { processTestCases } from './processTestCases.js';

export function testCommaFixer(logger) {
	const cases = [
		{'code': 'print [1 2]', 'logged': false},
		{'code': 'print [1, 2]', 'to': 'print [1 2]', 'logged': true},
		{'code': 'print [1,]', 'to': 'print [1]', 'logged': true},
		{'code': 'print [1,2]', 'to': 'print [1 2]', 'logged': true},
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