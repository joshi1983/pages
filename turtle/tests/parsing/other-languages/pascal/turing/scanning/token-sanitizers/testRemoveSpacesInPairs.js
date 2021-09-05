import { processSanitizeTestCases } from
'./processSanitizeTestCases.js';
import { removeSpacesInPairs } from
'../../../../../../../modules/parsing/other-languages/pascal/turing/scanning/token-sanitizers/removeSpacesInPairs.js';

export function testRemoveSpacesInPairs(logger) {
	const cases = [
		{'code': 'x in y', 'tokens': ['x', 'in', 'y']},
		{'code': 'x not = y', 'tokens': ['x', 'not=', 'y']},
		{'code': 'x not\n= y', 'tokens': ['x', 'not', '=', 'y']},
			// Breaking the line is such an obvious problem that
			// there are likely other problems nearby.
			// Joining the not = together would get a very specific problem fixed but
			// at the expense of making other problems more confusing.
			
		{'code': 'x : = y', 'tokens': ['x', ':=', 'y']},
		{'code': 'x < = y', 'tokens': ['x', '<=', 'y']},
		{'code': 'x > = y', 'tokens': ['x', '>=', 'y']},
	];
	processSanitizeTestCases(cases, removeSpacesInPairs, logger);
};