;import { procedureToSub } from
'../../../../../../modules/parsing/other-languages/basic/amos-basic/scanning/procedureToSub.js';
import { processScanTokensTestCases } from './processScanTokensTestCases.js';

export function testProcedureToSub(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'procedure a\nend proc',
			'tokens': ['sub', 'a', 'end', 'sub']}
	];
	processScanTokensTestCases(cases, procedureToSub, logger);
};