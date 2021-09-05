import { mergeSpacedOperators } from
'../../../../../../modules/parsing/other-languages/python/scanning/token-sanitizers/mergeSpacedOperators.js';
import { processSanitizeTestCases } from './processSanitizeTestCases.js';

export function testMergeSpacedOperators(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'not', 'tokens': ['not']},
		{'code': 'not x', 'tokens': ['not', 'x']},
		{'code': 'not True', 'tokens': ['not', 'True']},
		{'code': 'not in', 'tokens': ['not in']},
		{'code': 'not in []', 'tokens': ['not in', '[', ']']},
		{'code': 'not \\\nin []', 'tokens': ['not in', '\\\n', '[', ']']},
	];
	processSanitizeTestCases(cases, mergeSpacedOperators, logger);
};