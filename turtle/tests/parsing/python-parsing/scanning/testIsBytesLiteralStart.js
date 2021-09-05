import { isBytesLiteralStart } from
'../../../../modules/parsing/python-parsing/scanning/isBytesLiteralStart.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsBytesLiteralStart(logger) {
	const cases = [
		{'in': '123', 'out': false},
		{'in': '12.3', 'out': false},
		{'in': '"Hello"', 'out': false},
		{'in': 'x', 'out': false},
		{'in': 'b', 'out': true},
		{'in': 'b"', 'out': true},
		{'in': 'B"', 'out': true},
		{'in': 'b"Hello"', 'out': true},
		{'in': 'B"Hello"', 'out': true},
		{'in': 'b"Hello world"', 'out': true},
		{'in': 'b""', 'out': true},
		{'in': 'b"GIF89a"', 'out': true},
		{'in': 'b"G\\"', 'out': true}, // last quote is escaped but that is ok for the START of a bytes literal.
		{'in': 'b"\\\\"', 'out': true},
	];
	testInOutPairs(cases, isBytesLiteralStart, logger);
};