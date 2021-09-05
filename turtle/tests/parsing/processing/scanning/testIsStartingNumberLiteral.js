import { isStartingNumberLiteral } from
'../../../../modules/parsing/processing/scanning/isStartingNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsStartingNumberLiteral(logger) {
	const cases = [
	{'in': '-', 'out': true},
	{'in': '0', 'out': true},
	{'in': '1', 'out': true},
	{'in': '-1', 'out': true},
	{'in': '-1.234', 'out': true},
	{'in': '1.234', 'out': true},
	{'in': '#', 'out': true},
	{'in': '#1', 'out': true},
	{'in': '#a', 'out': true},
	{'in': '#112233', 'out': true},
	{'in': '#11223344', 'out': true},
	{'in': '0x', 'out': true},
	{'in': '0x1', 'out': true},
	{'in': '0x11223344', 'out': true},
	{'in': '0xa', 'out': true},
	{'in': '0xA', 'out': true},
	{'in': '0xG', 'out': false},
	{'in': '#11223344.234', 'out': false},
	{'in': '0x11223344.234', 'out': false},
	{'in': 'a', 'out': false},
	{'in': 'A', 'out': false},
	{'in': '123a', 'out': false},
	{'in': 'a1', 'out': false},
	{'in': ' 0', 'out': false},
	{'in': ' #', 'out': false},
	{'in': '1#', 'out': false},
	];
	testInOutPairs(cases, isStartingNumberLiteral, logger);
};