import { amosHexNumberLiteralsToQBasicHexLiterals } from
'../../../../../modules/parsing/basic/amos-basic/scanning/amosHexNumberLiteralsToQBasicHexLiterals.js';
import { processScanTokensTestCases } from './processScanTokensTestCases.js';

export function testAmosHexNumberLiteralsToQBasicHexLiterals(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'x=$f12',
			'tokens': ['x', '=', '&hf12']},
	];
	processScanTokensTestCases(cases, amosHexNumberLiteralsToQBasicHexLiterals, logger);
};