import { expandAbbreviatedKeywords } from
'../../../../../../../modules/parsing/other-languages/pascal/turing/scanning/token-sanitizers/expandAbbreviatedKeywords.js';
import { processSanitizeTestCases } from
'./processSanitizeTestCases.js';

export function testExpandAbbreviatedKeywords(logger) {
	const cases = [
		{'code': 'proc', 'tokens': ['proc']},
		{'code': 'fcn', 'tokens': ['fcn']},
		{'code': 'proc p()', 'tokens': ['procedure', 'p', '(', ')']},
		{'code': 'fcn f()', 'tokens': ['function', 'f', '(', ')']}
	];
	processSanitizeTestCases(cases, expandAbbreviatedKeywords, logger);
};