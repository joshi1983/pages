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
		'out': 'for y in z:'}
	];
	processTestCases(cases, simplifyForLoopInEnumerate, logger);
};