import { forToConditionToken } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forToConditionToken.js';
import { processTokenToTokenCases } from './processTokenToTokenCases.js';

export function testForToConditionToken(logger) {
	const cases = [
	{'code': 'for', 'outToken': null},
	{'code': 'for (', 'outToken': null},
	{'code': 'for (;;) {}',
		'outToken': null
	},
	{'code': 'for (; 1;C) {}',
		'outToken': {'val': '1'}
	},
	{'code': 'for (; true;C) {}',
		'outToken': {'val': 'true'}
	},
	{'code': 'for (; B;) {}',
		'outToken': {'val': 'B'}
	},
	{'code': 'for (; B;C) {}',
		'outToken': {'val': 'B'}
	},
	{'code': 'for (A; B;) {}',
		'outToken': {'val': 'B'}
	},
	{'code': 'for (A; B; C) {}',
		'outToken': {'val': 'B'}
	}
	];
	processTokenToTokenCases(cases, forToConditionToken, logger);
};