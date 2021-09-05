import { isBase10NumberLiteralStart } from
'../../../../modules/parsing/qbasic/scanning/isBase10NumberLiteralStart.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsBase10NumberLiteralStart(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'x', 'out': false},
	{'in': '<', 'out': false},
	{'in': '>', 'out': false},
	{'in': '=', 'out': false},
	{'in': '<9', 'out': false},
	{'in': '1-', 'out': false},
	{'in': '&H3DA', 'out': false}, // hex
	{'in': '&', 'out': false}, // hex
	{'in': '&H', 'out': false}, // hex
	{'in': '-', 'out': true},
	{'in': '.', 'out': true},
	{'in': '-.', 'out': true},
	{'in': '1', 'out': true},
	{'in': '0.1', 'out': true},
	{'in': '.3', 'out': true},
	{'in': '-.0', 'out': true},
	{'in': '-.3', 'out': true},
	{'in': '3.14', 'out': true},
	{'in': '-3.14', 'out': true},
	{'in': '-3#', 'out': true},
	{'in': '3#', 'out': true},
	];
	testInOutPairs(cases, isBase10NumberLiteralStart, logger);
};