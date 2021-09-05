import { isNumberLiteralStart } from
'../../../../../modules/parsing/basic/qbasic/scanning/isNumberLiteralStart.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsNumberLiteralStart(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'x', 'out': false},
	{'in': '<', 'out': false},
	{'in': '>', 'out': false},
	{'in': '=', 'out': false},
	{'in': '<9', 'out': false},
	{'in': '1-', 'out': false},
	{'in': '-', 'out': true},
	{'in': '.', 'out': true},
	{'in': '-.', 'out': true},
	{'in': '1', 'out': true},
	{'in': '123', 'out': true},
	{'in': '-123', 'out': true},
	{'in': '0.1', 'out': true},
	{'in': '.3', 'out': true},
	{'in': '-.0', 'out': true},
	{'in': '-.3', 'out': true},
	{'in': '-3', 'out': true},

	{'in': '–.', 'out': true}, // the – looks like - but it is not.
	{'in': '–1', 'out': true}, // the – looks like - but it is not.
	// We still want –1 to be classified as a number literal start, though.
	
	{'in': '3.14', 'out': true},
	{'in': '-3.14', 'out': true},
	{'in': '1.5E-2', 'out': true}, // copied from the initial value of variable DH in https://github.com/oonap0oo/QB64-projects/blob/main/linesani.bas
	{'in': '&H3DA', 'out': true}, // hex
	{'in': '&', 'out': true}, // hex or octal
	{'in': '&H', 'out': true}, // hex
	{'in': '&O', 'out': true}, // octal
	{'in': '&O2', 'out': true},
	{'in': '&010', 'out': true}, // octal
	];
	testInOutPairs(cases, isNumberLiteralStart, logger);
};