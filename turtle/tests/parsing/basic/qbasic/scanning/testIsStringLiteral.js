import { isStringLiteral } from
'../../../../../modules/parsing/basic/qbasic/scanning/isStringLiteral.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsStringLiteral(logger) {
	const cases = [
	{'in': '3', 'out': false},
	{'in': 'x', 'out': false},
	{'in': '(', 'out': false},
	{'in': '[', 'out': false},
	{'in': '\'hello', 'out': false},
	{'in': '"hello', 'out': true},
	{'in': '"hello"', 'out': true},
	{'in': '”', 'out': true},
	{'in': '“', 'out': true},
	{'in': '”hello', 'out': true},
	{'in': '”hello”', 'out': true},
	{'in': '” The age is “', 'out': true},
	];
	testInOutPairs(cases, isStringLiteral, logger);
};