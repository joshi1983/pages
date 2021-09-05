import { commaFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/commaFixer.js';
import { processTestCase } from './processTestCase.js';

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
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, commaFixer, logger);
	});
};