import { processTestCases } from
'./processTestCases.js';
import { simplifyLen } from
'../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/simplifyLen.js';

export function testSimplifyLen(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'for x in z:', 'changed': false},
		{'code': 'for x in range(len(z)):', 'changed': false},
		{'code': 'for x in range(bla.len([3,5])):', 'changed': false},
		{'code': 'for x in range(len([])):',
			'out': 'for x in range(0):'},
		{'code': 'for x in range(len([7,8,9])):',
			'out': 'for x in range(3):'},
	];
	processTestCases(cases, simplifyLen, logger);
};