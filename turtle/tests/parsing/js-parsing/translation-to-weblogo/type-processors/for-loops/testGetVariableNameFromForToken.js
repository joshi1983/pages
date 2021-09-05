import { getVariableNameFromForToken } from
'../../../../../../modules/parsing/js-parsing/translation-to-weblogo/type-processors/for-loops/getVariableNameFromForToken.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { wrappedForTestFunction } from './wrappedForTestFunction.js';

export function testGetVariableNameFromForToken(logger) {
	const cases = [
	{'in': 'for', 'out': undefined},
	{'in': 'for {}', 'out': undefined},
	{'in': 'for (;;) {}', 'out': undefined}, // default to x when actually it is unknown.
	{'in': 'for (var y = 0;;) {}', 'out': 'y'},
	{'in': 'for (var y = 3;;) {}', 'out': 'y'},
	{'in': 'for (y++;;) {}', 'out': 'y'},
	{'in': 'for (++y;;) {}', 'out': 'y'},
	{'in': 'for (let y;;) {}', 'out': 'y'},
	{'in': 'for (let y=3;;) {}', 'out': 'y'},
	{'in': 'for (let y=3;y<10;y++) {}', 'out': 'y'},
	{'in': 'for (let z=3+34*2+y;y<10;y++) {}', 'out': 'z'},
	{'in': 'for (let y=3, z=4;y<10;y++) {}', 'out': undefined},
	{'in': 'for (let y="";y.length<10;y+="a") {}', 'out': 'y'},
	];
	testInOutPairs(cases, wrappedForTestFunction(getVariableNameFromForToken, logger), logger);
};