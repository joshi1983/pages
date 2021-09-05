import { isIdentifier } from
'../../../../modules/parsing/qbasic/scanning/isIdentifier.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	const cases = [
		{'in': '', 'out': false},
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
		{'in': 'i&&', 'out': true},

		// some cases from https://yamsoti.com/variables-in-qbasic/
		// Contrary to that website, we don't want "." included in identifiers
		// because "." can denote properties of custom data types.
		{'in': 'First_Name$', 'out': true},
		{'in': 'FirstName$', 'out': true},
		{'in': '12abc', 'out': false},
	];
	testInOutPairs(cases, isIdentifier, logger);
};