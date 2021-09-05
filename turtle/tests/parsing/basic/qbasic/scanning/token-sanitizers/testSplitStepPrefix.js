import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { splitStepPrefix } from
'../../../../../../modules/parsing/basic/qbasic/scanning/token-sanitizers/splitStepPrefix.js';

export function testSplitStepPrefix(logger) {
	const cases = [
		{'code': 'step',
			'tokens': ['step']
		},
		{'code': 'step x',
			'tokens': ['step', 'x']
		},
		{'code': 'stepValue',
			'tokens': ['stepValue']
			// without a preceding 'for', the 'step' keyword is not expected.
		},
		{'code': 'step3',
			'tokens': ['step3']
			// without a preceding 'for', the 'step' keyword is not expected.
		},
		{'code': 'for x=0 to 10 step3',
			'tokens': ['for', 'x', '=', '0', 'to', '10', 'step', '3']
			// 'step' keyword is expected.
		}
	];
	processTokenSanitizersTestCases(cases, splitStepPrefix, logger);
};