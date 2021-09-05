import { processTestCases } from
'./processTestCases.js';
import { simplifyForLoopInEnumerate } from
'../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/simplifyForLoopInEnumerate.js';

export function testSimplifyForLoopInEnumerate(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'for x in z:', 'changed': false},
		{'code': 'for x in enumerate(z):', 'changed': false},
		{'code': 'for x,y in enumerate(z):\n\tprint(x)',
		'changed': false},// unchanged because it is reading the first value.
		{'code': 'for [x,y] in enumerate(z):\n\tprint(x)',
		'changed': false},// unchanged because it is reading the first value.
		{'code': 'for (x,y) in enumerate(z):\n\tprint(x)',
		'changed': false},// unchanged because it is reading the first value.
		{'code': 'for x,y in enumerate(z):',
		'out': 'for y in z:'},
		{'code': 'for [x,y] in enumerate(z):',
		'out': 'for y in z:'},
		{'code': 'for (x,y) in enumerate(z):',
		'out': 'for y in z:'},
		{'code': 'for x,y in enumerate(z):\n\tprint(3)',
		'out': 'for y in z:\n\tprint(3)'},
		{'code': 'for [x,y] in enumerate(z):\n\tprint(3)',
		'out': 'for y in z:\n\tprint(3)'},
		{'code': 'for (x,y) in enumerate(z):\n\tprint(3)',
		'out': 'for y in z:\n\tprint(3)'},
		{'code': 'for x,y in enumerate(z):\n\tprint(y)',
		'out': 'for y in z:\n\tprint(y)'},
		{'code': 'for [x,y] in enumerate(z):\n\tprint(y)',
		'out': 'for y in z:\n\tprint(y)'},
		{'code': 'for (x,y) in enumerate(z):\n\tprint(y)',
		'out': 'for y in z:\n\tprint(y)'},
		{'code': 'for x,y in enumerate([20, 40, 60]):\n\tprint("hi")',
		'out': 'for y in [20, 40, 60]:\n\tprint("hi")'}
	];
	processTestCases(cases, simplifyForLoopInEnumerate, logger);
};