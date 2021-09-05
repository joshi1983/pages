import { getInitialValue } from
'../../../../../../modules/parsing/js-parsing/translation-to-weblogo/type-processors/for-loops/getInitialValue.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { wrappedForTestFunction } from './wrappedForTestFunction.js';

export function testGetInitialValue(logger) {
	const cases = [
	{'in': 'for', 'out': undefined},
	{'in': 'for {}', 'out': undefined},
	{'in': 'for (;;) {}', 'out': undefined},
	{'in': 'for (; y < 4;) {}', 'out': undefined},
	{'in': 'for (y++; true;) {}', 'out': undefined},
	{'in': 'for (++y; true;) {}', 'out': undefined},
	{'in': 'for (y--; true;) {}', 'out': undefined},
	{'in': 'for (--y; true;) {}', 'out': undefined},
	{'in': 'for (y+=1; true;) {}', 'out': undefined},
	{'in': 'for (y-=1; true;) {}', 'out': undefined},
	{'in': 'for (y = 3, z=4; true;) {}', 'out': undefined},
	{'in': 'for (y=3; true;) {}', 'out': 3},
	{'in': 'for (var y = 0;;) {}', 'out': 0},
	{'in': 'for (var y = 3; true;) {}', 'out': 3},
	{'in': 'for (y = 3; true;) {}', 'out': 3},
	{'in': 'for (var y = 4; y < 14;) {}', 'out': 4},
	{'in': 'for (let y="";y.length<10;y+="a") {}', 'out': ""},
	];
	testInOutPairs(cases, wrappedForTestFunction(getInitialValue, logger), logger);
};