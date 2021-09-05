import { getIncrementAmountFromForToken } from
'../../../../../../modules/parsing/js-parsing/translation-to-weblogo/type-processors/for-loops/getIncrementAmountFromForToken.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { wrappedForTestFunction } from './wrappedForTestFunction.js';

export function testGetIncrementAmountFromForToken(logger) {
	const cases = [
	{'in': 'for (var x) {}', 'out': undefined},
	{'in': 'for (var x = 0; x < 10;) {}', 'out': 0},
	{'in': 'for (var x = 0; x < 10; x++) {}', 'out': 1},
	{'in': 'for (var x = 0; x < 10; x++,y++) {}', 'out': undefined},
	// undefined because the increment step is having more effects than just adding 1 to x.

	{'in': 'for (var x = 0; x < 10; ++x) {}', 'out': 1},
	{'in': 'for (var x = 0; x < 10; x--) {}', 'out': -1},
	{'in': 'for (var x = 0; x < 10; --x) {}', 'out': -1},
	{'in': 'for (var x = 0; x < 10; x+=2) {}', 'out': 2},
	{'in': 'for (var x = 0; x < 10; x-=2) {}', 'out': -2},
	{'in': 'for (var x = 1; x < 10; x*=2) {}', 'out': undefined},
	// undefined because it isn't being incremented.  It is getting multiplied.

	{'in': 'for (var x = 100; x > 1; x/=2) {}', 'out': undefined},
	{'in': 'for (var x = 100; x > 1; x**=2) {}', 'out': undefined},
	{'in': 'for (var x = 0; x < 10; x+=0.2) {}', 'out': 0.2},
	];
	testInOutPairs(cases, wrappedForTestFunction(getIncrementAmountFromForToken, logger), logger);
};