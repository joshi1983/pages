import { joinOperatorsContainingWhitespace } from
'../../../../../../../modules/parsing/other-languages/pascal/turing/scanning/token-sanitizers/joinOperatorsContainingWhitespace.js';
import { processSanitizeTestCases } from
'./processSanitizeTestCases.js';

export function testJoinOperatorsContainingWhitespace(logger) {
	const cases = [
		{'code': 'x in y', 'tokens': ['x', 'in', 'y']},
		{'code': 'x not in y', 'tokens': ['x', 'not in', 'y']}
	];
	processSanitizeTestCases(cases, joinOperatorsContainingWhitespace, logger);
};