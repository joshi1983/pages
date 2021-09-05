import { getLimitFromForToken } from
'../../../../../../modules/parsing/js-parsing/translation-to-weblogo/type-processors/for-loops/getLimitFromForToken.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { wrappedForTestFunction } from './wrappedForTestFunction.js';

export function testGetLimitFromForToken(logger) {
	const cases = [
	{'in': 'for', 'out': undefined},
	{'in': 'for {}', 'out': undefined},
	{'in': 'for (;;) {}', 'out': undefined},
	{'in': 'for (; y < 4;) {}', 'out': 4},
	{'in': 'for (var y = 0;;) {}', 'out': undefined},
	{'in': 'for (var y = 3; true;) {}', 'out': undefined},
	{'in': 'for (var y = 3; y < 4;) {}', 'out': 4},
	{'in': 'for (var y = 3; 4 < y;) {}', 'out': 4},
	{'in': 'for (var y = 3; y > 4;) {}', 'out': 4},
	{'in': 'for (var y = 3; y > 1+2;) {}', 'out': 3},
	{'in': 'for (var y = 3; y >= 1+2;) {}', 'out': 3},
	{'in': 'for (var y = 3; y !== 1+2;) {}', 'out': 3},
	{'in': 'for (var y = 3; y != 1+2;) {}', 'out': 3},
	{'in': 'for (let y="";y.length<10;y+="a") {}', 'out': 10},
	];
	testInOutPairs(cases, wrappedForTestFunction(getLimitFromForToken, logger), logger);
};