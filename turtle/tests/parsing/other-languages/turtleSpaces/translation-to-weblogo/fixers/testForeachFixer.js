import { foreachFixer } from
'../../../../../../modules/parsing/other-languages/turtleSpaces/translation-to-weblogo/fixers/foreachFixer.js';
import { processTestCases } from
'../../../../../components/code-editor/code-fixer/fixers/processTestCases.js';

export function testForeachFixer(logger) {
	const cases = [
		{'code': 'foreach :x []', 'logged': false},
		{'code': 'foreach "x []', 'logged': false},
		{'code': 'foreach "x [] []',
		'to': '   ', 'logged': true},
		{'code': `foreach "x [] []
print :x`, 'to': `make "x 1 
print :x`, 'logged': true
		},
		{'code': 'foreach "x [1 2 3] [print :x]',
		'to': `make "_1  [1 2 3] repeat count:_1[make "x item repcount:_1 print :x]`, 'logged': true
		},
		{'code': 'foreach "x :variable1 [print :x]',
		'to': `repeat count :variable1 [make "x item repcount:variable1 print :x]`, 'logged': true
		},
	];
	processTestCases(cases, foreachFixer, logger);
};