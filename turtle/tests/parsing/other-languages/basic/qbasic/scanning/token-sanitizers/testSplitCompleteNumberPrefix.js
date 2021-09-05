import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { splitCompleteNumberPrefix } from
'../../../../../../../modules/parsing/other-languages/basic/qbasic/scanning/token-sanitizers/splitCompleteNumberPrefix.js';

export function testSplitCompleteNumberPrefix(logger) {
	const cases = [
		{'code': 'step',
			'tokens': ['step']
		},
		{'code': '3step',
			'tokens': ['3', 'step']
		}
	];
	processTokenSanitizersTestCases(cases, splitCompleteNumberPrefix, logger);
};