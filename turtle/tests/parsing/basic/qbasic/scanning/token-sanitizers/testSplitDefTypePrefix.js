import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { splitDefTypePrefix } from
'../../../../../../modules/parsing/basic/qbasic/scanning/token-sanitizers/splitDefTypePrefix.js';

export function testSplitDefTypePrefix(logger) {
	const cases = [
		{'code': 'defdbl',
			'tokens': ['defdbl']
		},
		{'code': 'defint',
			'tokens': ['defint']
		},
		{'code': 'defstr',
			'tokens': ['defstr']
		},
		{'code': 'defsng',
			'tokens': ['defsng']
		},
		{'code': 'defint3',
			'tokens': ['defint3']
			// 3 is not a valid variable name so don't split.
			// Splitting won't lead to a valid QBASIC variable definition.
		},
		{'code': 'definta',
			'tokens': ['defint', 'a']
		},
		{'code': 'defdbla',
			'tokens': ['defdbl', 'a']
		},
		{'code': 'DEFINTA-Z',
			'tokens': ['DEFINT', 'A', '-', 'Z']
		},
		{'code': 'CLEAR2000:DEFINTA-Z',
			'tokens': ['CLEAR2000', ':', 'DEFINT', 'A', '-', 'Z']
		},
		{'code': 'defdblx',
			'tokens': ['defdbl', 'x']
		}
	];
	processTokenSanitizersTestCases(cases, splitDefTypePrefix, logger);
};