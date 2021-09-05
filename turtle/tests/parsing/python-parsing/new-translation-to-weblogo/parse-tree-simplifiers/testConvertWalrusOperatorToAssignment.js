import { convertWalrusOperatorToAssignment } from
'../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/convertWalrusOperatorToAssignment.js';
import { processTestCases } from
'./processTestCases.js';

export function testConvertWalrusOperatorToAssignment(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'x=3', 'changed': false},
		{'code': 'x:=3', 'out': 'x=3'},
		{'code': 'print(x:=3)',
			'out': 'x=3\nprint(x)'},
		{'code': 'print(x:=y+3)',
			'out': 'x=y+3\nprint(x)'},
	];
	processTestCases(cases, convertWalrusOperatorToAssignment, logger);
};