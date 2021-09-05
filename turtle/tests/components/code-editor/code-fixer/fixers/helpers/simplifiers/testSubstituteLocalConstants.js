import { processTestCases } from
'../../processTestCases.js';
import { substituteLocalConstants } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/substituteLocalConstants.js';

export function testSubstituteLocalConstants(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'make "x 2', 'logged': false},
		{'code': 'print :x', 'logged': false},
		{'code': 'make "x 2\nprint :x', 'logged': false},
			// we don't want to remove global variables because
			// assigning a value to a global variable is an important effect of running a Logo program.
			// A user might type print :x in the Commander after running the program to see its value.
			// Removing the global variable would change that behaviour.

		{'code': 'to p\nprint :x\nend', 'logged': false},
		{'code': 'to p :x\nprint :x\nend', 'logged': false},
		{'code': 'to p :x\nmake "x createPList\nprint :x\nend', 'logged': false},
		{'code': 'to p :x\nmake "x 3\nprint :x\nend',
			'to': `to p :x
  
print 3
end`,
			'logged': true},
	];
	processTestCases(cases, substituteLocalConstants, logger);
};