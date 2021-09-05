import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { splitStatementPrefix } from
'../../../../../../modules/parsing/basic/qbasic/scanning/token-sanitizers/splitStatementPrefix.js';

export function testSplitStatementPrefix(logger) {
	const cases = [
		{'code': 'IF INKEY$=""THEN100',
			'tokens': ['IF', 'INKEY$', '=', '""', 'THEN', '100']
		}
	];
	processTokenSanitizersTestCases(cases, splitStatementPrefix, logger);
};