import { processTestCases } from
'./processTestCases.js';
import { simplifyForLoopInEnumerateToRange } from
'../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/simplifyForLoopInEnumerateToRange.js';

export function testSimplifyForLoopInEnumerateToRange(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'for x in z:', 'changed': false},
		{'code': 'for x in enumerate(z):', 'changed': false},
		{'code': 'for x,y in enumerate([20, 40, 60]):\n\tprint("hi")',
		'changed': false},
		{'code': 'for x,y in enumerate(z):\n\tprint(x)',
		'out': 'for x in range(len(z)):\n\tprint(x)'},
		{'code': 'for [x,y] in enumerate(z):\n\tprint(x)',
		'out': 'for x in range(len(z)):\n\tprint(x)'},
		{'code': 'for (x,y) in enumerate(z):\n\tprint(x)',
		'out': 'for x in range(len(z)):\n\tprint(x)'},
		{'code': 'for x,y in enumerate([4,5]):\n\tprint(x)',
		'out': 'for x in range(len([4,5])):\n\tprint(x)'}
	];
	processTestCases(cases, simplifyForLoopInEnumerateToRange, logger);
};