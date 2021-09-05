import { isOctalNumberLiteralStart } from
'../../../../../modules/parsing/basic/qbasic/scanning/isOctalNumberLiteralStart.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsOctalNumberLiteralStart(logger) {
	const cases = [
	{'in': 'H', 'out': false},
	{'in': 'h', 'out': false},
	{'in': 'D', 'out': false},
	{'in': 'F', 'out': false},
	{'in': '1', 'out': false},
	{'in': '&H3DAj', 'out': false},
	{'in': '&', 'out': true},
	{'in': '&H', 'out': false},
	{'in': '&H3', 'out': false},
	{'in': '&H3D', 'out': false},
	{'in': '&H3DA', 'out': false},
	{'in': '&H123', 'out': false},
	{'in': '#', 'out': false},
	{'in': '#f', 'out': false},
	{'in': '#f&', 'out': false},
	{'in': '&o', 'out': true},
	{'in': '&O', 'out': true},
	{'in': '&O1', 'out': true},
	{'in': '&O123', 'out': true},
	{'in': '&01', 'out': true},
	{'in': '&010', 'out': true},
	];
	testInOutPairs(cases, isOctalNumberLiteralStart, logger);
};