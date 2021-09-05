import { nameCallFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/nameCallFixer.js';
import { processTestCases } from './processTestCases.js';

export function testNameCallFixer(logger) {
	const cases = [
		{'code': 'make "x 5', 'logged': false},
		{'code': 'name', 'logged': false},
		{'code': 'name "x', 'logged': false},
		{'code': 'name 4', 'logged': false},
		{'code': '[name 4]', 'logged': false},
		{'code': 'to p\nname 4\nend', 'logged': false},
		{'code': 'to p\nname 4 "x\nend', 'to': 'to p\nmake "x 4\nend', 'logged': true},
		{'code': 'name 4 "x', 'to': 'make "x 4', 'logged': true},
		{'code': 'name 4\n"x', 'to': 'make "x\n4', 'logged': true},
		{'code': 'name [] "x', 'to': 'make "x []', 'logged': true},
		{'code': 'name []\n"x', 'to': 'make "x\n[]', 'logged': true},
		{'code': 'name [1 2 3] "x', 'to': 'make "x [1 2 3]', 'logged': true}
	];
	processTestCases(cases, nameCallFixer, logger);
};