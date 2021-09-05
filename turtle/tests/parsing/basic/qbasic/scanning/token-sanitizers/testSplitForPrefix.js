import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { splitForPrefix } from
'../../../../../../modules/parsing/basic/qbasic/scanning/token-sanitizers/splitForPrefix.js';

export function testSplitForPrefix(logger) {
	const cases = [
		{
			'code': 'for4',
			'tokens': ['for4'] // 4 is not an identifier so don't split.
		},
		{
			'code': 'for4 = 5 to step',
			'tokens': ['for4', '=', '5', 'to', 'step'] // 4 is not an identifier so don't split.
			// even though the 'to' is in the same line, splitting for4 into for 4 won't make it valid QBasic code.
		},
		{
			'code': 'forx=4 to 10\nnext x',
			'tokens': ['for', 'x', '=', '4', 'to', '10', 'next', 'x']
		},
		{
			'code': 'forx=4',
			'tokens': ['forx', '=', '4']
		},
		{
			'code': 'forx=4+y',
			'tokens': ['forx', '=', '4', '+', 'y']
		},
		{
			'code': 'forx=4*y',
			'tokens': ['forx', '=', '4', '*', 'y']
		},
		{
			'code': 'FORI=0TO192 STEP 8',
			'tokens': ['FOR', 'I', '=', '0', 'TO', '192', 'STEP', '8']
		}
	];
	processTokenSanitizersTestCases(cases, splitForPrefix, logger);
};