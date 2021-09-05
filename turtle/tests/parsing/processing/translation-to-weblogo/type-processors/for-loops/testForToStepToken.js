import { forToStepToken } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forToStepToken.js';
import { processTokenToTokenCases } from './processTokenToTokenCases.js';

export function testForToStepToken(logger) {
	const cases = [
	{'code': 'for', 'outToken': null},
	{'code': 'for (', 'outToken': null},
	{'code': 'for (int x: a) {}',
		'outToken': null
	},
	{'code': 'for (A; B;) {}',
		'outToken': null
	},
	{'code': 'for (;; C) {}',
		'outToken': {'val': 'C'}
	},
	{'code': 'for (A;; C) {}',
		'outToken': {'val': 'C'}
	},
	{'code': 'for (A; B; C) {}',
		'outToken': {'val': 'C'}
	}
	];
	processTokenToTokenCases(cases, forToStepToken, logger);
};