import { processScanTokensTestCases } from './processScanTokensTestCases.js';
import { processOperators } from
'../../../../../modules/parsing/basic/micro-a/scanning/processOperators.js';

export function testProcessOperators(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'print !true',
		'tokens': ['print', 'not', 'true']},
		{'code': 'print true&false',
		'tokens': ['print', 'true', 'and', 'false']},
		{'code': 'print true|false',
		'tokens': ['print', 'true', 'or', 'false']},
		{'code': '\' comment!', 'tokens': ['\' comment!']},
		{'code': '\' comment|', 'tokens': ['\' comment|']},
		{'code': '\' comment&', 'tokens': ['\' comment&']},
		{'code': '\' comment<', 'tokens': ['\' comment<']},
	];
	processScanTokensTestCases(cases, processOperators, logger);
};