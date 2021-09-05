import { addToAssignment } from
'../../../../../modules/parsing/basic/amos-basic/scanning/addToAssignment.js';
import { processScanTokensTestCases } from './processScanTokensTestCases.js';

export function testAddToAssignment(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'add x,1',
			'tokens': ['x', '=', 'x', '+', '1']},
	];
	processScanTokensTestCases(cases, addToAssignment, logger);
};