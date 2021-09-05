import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { splitDimPrefix } from
'../../../../../../modules/parsing/basic/qbasic/scanning/token-sanitizers/splitDimPrefix.js';

export function testSplitDimPrefix(logger) {
	const cases = [
		{'code': 'Dim',
			'tokens': ['Dim']
		},
		{'code': 'DimD$',
			'tokens': ['Dim', 'D$']
		},
		{'code': 'DimD$(10)',
			'tokens': ['Dim', 'D$', '(', '10', ')']
		},
	];
	processTokenSanitizersTestCases(cases, splitDimPrefix, logger);
};