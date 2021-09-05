import { foreverIfBreakToWhile } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/foreverIfBreakToWhile.js';
import { processTestCases } from
'../../processTestCases.js';

export function testForeverIfBreakToWhile(logger) {
	const cases = [
		{'code': `make "x 0
forever [
	make "x :x + 1
]`, 'logged': false
		},{'code': `make "x 0
forever [
	(4+3)
	make "x :x + 1
]`, 'logged': false
		},{'code': `make "x 0
forever [
	if :x < 3 [
	]
	make "x :x + 1
]`, 'logged': false
		},{'code': `make "x 0
forever [
	if :x < 3 [
		break
	]
	make "x :x + 1
]`, 'to': `make "x 0
while 
	not :x < 3 
		
	[
	make "x :x + 1
]`, 'logged': true
		}
	];
	processTestCases(cases, foreverIfBreakToWhile, logger);
};