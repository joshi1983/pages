import { forToInitToken } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forToInitToken.js';
import { processTokenToTokenCases } from './processTokenToTokenCases.js';

export function testForToInitToken(logger) {
	const cases = [
	{'code': 'for', 'outToken': null},
	{'code': 'for (', 'outToken': null},
	{'code': 'for (int x: a) {}',
		'outToken': null
	},
	{'code': 'for (; B; C) {}',
		'outToken': null
	},
	{'code': 'for (A; B; C) {}',
		'outToken': {'val': 'A'}
	}
	];
	processTokenToTokenCases(cases, forToInitToken, logger);
};