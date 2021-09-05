import { processScanTokensTestCases } from './processScanTokensTestCases.js';
import { processStrDeclarations } from
'../../../../../modules/parsing/basic/micro-a/scanning/processStrDeclarations.js';

export function testProcessStrDeclarations(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'str', 'tokens': ['str']}, 
		// weird Micro(A) code but leave it alone if it doesn't match what processStrDeclarations is intended for.
		// converting 'str' to 'let' without a corresponding identifier would lead to invalid QBASIC code.

		{'code': 'str x', 'tokens': ['let', 'x', '=', '""']},
		{'code': 'str x\nprint "hi"', 'tokens': ['let', 'x', '=', '""', 'print', '"hi"']},
		{'code': 'str x,y', 'tokens': ['let', 'x', '=', '""', ',', 'y', '=', '""']},
		{'code': 'str x,y\nprint "hi"', 'tokens': ['let', 'x', '=', '""', ',', 'y', '=', '""', 'print', '"hi"']},
	];
	processScanTokensTestCases(cases, processStrDeclarations, logger);
};