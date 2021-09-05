import { minusSignSpaceInsertFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/minusSignSpaceInsertFixer.js';
import { processTestCases } from './processTestCases.js';

export function testMinusSignSpaceInsertFixer(logger) {
	const cases = [
		{'code': 'print 1', 'logged': false},
		{'code': 'print -1', 'logged': false},
		{'code': 'print -:x', 'logged': false},
		{'code': 'print -(1 + 3)', 'logged': false},
		{'code': 'repeat 2 [-1]', 'logged': false},
		{'code': 'clamp :percentage -100 100', 'logged': false},
		{'code': 'make "percentage clamp :percentage -100 100', 'logged': false},
		{'code': 'localmake "percentage clamp :percentage -100 100', 'logged': false},
		{'code': `to p :percentage
	localmake "percentage clamp :percentage -100 100
end`, 'logged': false},
		{'code': `to p :percentage
	localmake "percentage clamp :percentage -100 100
	localmake "redValue colorToRed penColor
end`, 'logged': false},
		{'code': 'print 2 -1', 'to': 'print 2 - 1', 'logged': true},
		{'code': 'print :x -1', 'to': 'print :x - 1', 'logged': true},
		{'code': 'print 1 -3 f', 'to': 'print 1 - 3 f', 'logged': true},
		{'code': 'repeat 2 [print :x -1]', 'to': 'repeat 2 [print :x - 1]', 'logged': true},
		{'code': 'print :x -:y', 'to': 'print :x - :y', 'logged': true},
		{'code': 'print :x -(1 + 3)', 'to': 'print :x - (1 + 3)', 'logged': true},
	];
	processTestCases(cases, minusSignSpaceInsertFixer, logger);
};