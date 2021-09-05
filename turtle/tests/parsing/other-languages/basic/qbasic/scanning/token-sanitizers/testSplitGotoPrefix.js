import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { splitGotoPrefix } from
'../../../../../../../modules/parsing/other-languages/basic/qbasic/scanning/token-sanitizers/splitGotoPrefix.js';

export function testSplitGotoPrefix(logger) {
	const cases = [
		{
			'code': 'goto4()',
			'tokens': ['goto4', '(', ')']
			// leave together because '4' is not a defined label.
		},
		{
			'code': `goto4
4 print`,
			'tokens': ['goto', '4', '4', 'print']
			// split now because '4' is a defined label.
		},
	];
	processTokenSanitizersTestCases(cases, splitGotoPrefix, logger);
};