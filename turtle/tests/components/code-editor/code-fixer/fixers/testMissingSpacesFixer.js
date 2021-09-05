import { missingSpacesFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/missingSpacesFixer.js';
import { processTestCases } from './processTestCases.js';

export function testMissingSpacesFixer(logger) {
	const cases = [
		{'code': 'print count5', 'logged': false},
		{'code': 'print 5', 'logged': false},
		{'code': 'forward 5', 'logged': false},
		{'code': 'forward :x', 'logged': false},
		{'code': 'forward:x', 'logged': false},
		// this kind of missing space fixer is handled by
		// variableReadSpaceInsertFixer instead.

		{'code': 'forward5', 'to': 'forward 5', 'logged': true},
		{'code': 'forward5 6', 'to': 'forward 5 6', 'logged': true},
		{'code': 'print5', 'to': 'print 5', 'logged': true},
		{'code': 'print15', 'to': 'print 15', 'logged': true},
		{'code': 'make " x', 'logged': false},
		{'code': 'print :x + x:y', 'logged': false},
		{'code': 'print -x:y', 'logged': false},
		{'code': 'print :x + :x * x:y', 'logged': false},
		{'code': `to p :x
	print :x
end

p3`, 'logged': false // Splitting that would be nice eventually.
// For now, we want a case to ensure no exceptions are thrown.
},
	];
	processTestCases(cases, missingSpacesFixer, logger);
};