import { isBytesLiteral } from
'../../../../modules/parsing/python-parsing/scanning/isBytesLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsBytesLiteral(logger) {
	const cases = [
		{'in': '123', 'out': false},
		{'in': '12.3', 'out': false},
		{'in': 'x', 'out': false},
		{'in': 'b"', 'out': false},
		{'in': 'B"', 'out': false},
		{'in': '"Hello"', 'out': false},
		{'in': 'b"H', 'out': false},
		// not a complete bytes literal.  The closing quotation mark is missing.

		{'in': 'b"\\"', 'out': false},
		// the last " is escaped so it should not mark the end of the literal.

		{'in': 'b"Hello"', 'out': true},
		{'in': 'B"Hello"', 'out': true},
		{'in': 'b"Hello world"', 'out': true},
		{'in': 'b""', 'out': true},
		{'in': 'b"GIF89a"', 'out': true},
		{'in': 'b"\\\\"', 'out': true}, // the backslash escapes the backslash but not the quote.
	];
	testInOutPairs(cases, isBytesLiteral, logger);
};