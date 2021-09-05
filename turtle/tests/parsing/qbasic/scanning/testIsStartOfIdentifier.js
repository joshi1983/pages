import { isStartOfIdentifier } from
'../../../../modules/parsing/qbasic/scanning/isStartOfIdentifier.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsStartOfIdentifier(logger) {
	const cases = [
		{'in': '', 'out': true},
		{'in': '>', 'out': false},
		{'in': '<', 'out': false},
		{'in': '(', 'out': false},
		{'in': '[', 'out': false},
		{'in': '*', 'out': false},
		{'in': '/', 'out': false},
		{'in': '=', 'out': false},
		{'in': '-', 'out': false},
		{'in': '.', 'out': false},
		{'in': '>9', 'out': false},
		{'in': '>-', 'out': false},
		{'in': 'x=', 'out': false},
		{'in': 'x,', 'out': false},
		{'in': 'x(', 'out': false},
		{'in': 'x[', 'out': false},
		{'in': 'n', 'out': true},
		{'in': 'nu', 'out': true},
		{'in': 'x', 'out': true},
		{'in': 'X', 'out': true},
		{'in': 'x$$', 'out': false},
		{'in': 'x%%', 'out': false},
		{'in': 'x&&&', 'out': false},
		{'in': 'x$', 'out': true},
		{'in': 'x!', 'out': true},
		{'in': 'x&', 'out': true},
		{'in': 'di&', 'out': true},
		{'in': 'number!', 'out': true},
		{'in': 'INKEY$', 'out': true},
		{'in': 'STR$', 'out': true},
		{'in': 'start#', 'out': true},
		{'in': 'Min%', 'out': true},
		{'in': 'i~%', 'out': true},
		{'in': 'i&&', 'out': true}
	];
	testInOutPairs(cases, isStartOfIdentifier, logger);
};