import { cssColorNameToHex } from
'../../../modules/parsing/css/cssColorNameToHex.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testCssColorNameToHex(logger) {
	const cases = [
	{'in': 'AliceBlue', 'out': '#f0f8ff'},
	{'in': 'red', 'out': '#ff0000'},
	{'in': 'blue', 'out': '#0000ff'},
	{'in': 'black', 'out': '#000000'},
	{'in': 'white', 'out': '#ffffff'},
	{'in': 'yellow', 'out': '#ffff00'}
	];
	testInOutPairs(cases, cssColorNameToHex, logger);
};