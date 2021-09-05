import { processTestCases } from
'../../processTestCases.js';
import { simplifyCreatePList2 } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyCreatePList2.js';

export function testSimplifyCreatePList2(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print createPList', 'logged': false},
		{'code': 'print createPList2 [[1 "hi ]]', 'logged': false},
		{'code': 'print createPList2 []',
			'to': 'print createPList ', 'logged': true},
	];
	processTestCases(cases, simplifyCreatePList2, logger);
};