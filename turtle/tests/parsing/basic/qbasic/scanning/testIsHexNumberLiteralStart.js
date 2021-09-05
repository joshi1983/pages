import { isHexNumberLiteralStart } from
'../../../../../modules/parsing/basic/qbasic/scanning/isHexNumberLiteralStart.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsHexNumberLiteralStart(logger) {
	const cases = [
	{'in': 'H', 'out': false},
	{'in': 'h', 'out': false},
	{'in': 'D', 'out': false}, // missing &h prefix
	{'in': 'F', 'out': false}, // missing &h prefix
	{'in': '1', 'out': false}, // a base 10 number but not hex
	{'in': '&H3DAj', 'out': false},
	{'in': '&', 'out': true},
	{'in': '&H', 'out': true},
	{'in': '&H3', 'out': true},
	{'in': '&H3D', 'out': true},
	{'in': '&H3DA', 'out': true},
	{'in': '&H123', 'out': true},
	{'in': '#', 'out': true},
	{'in': '#f', 'out': true},
	{'in': '#f&', 'out': true},
	];
	testInOutPairs(cases, isHexNumberLiteralStart, logger);
};