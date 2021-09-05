import { isOctalNumberLiteralStart } from
'../../../../modules/parsing/python-parsing/scanning/isOctalNumberLiteralStart.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsOctalNumberLiteralStart(logger) {
	const cases = [
		{'in': '0.', 'out': false},
		{'in': '0a', 'out': false},
		{'in': '0c', 'out': false},
		{'in': '0b', 'out': false},
		{'in': '0b0', 'out': false},
		{'in': '0b1', 'out': false},
		{'in': '0x1', 'out': false},
		{'in': '0x9', 'out': false},
		{'in': '0xa', 'out': false},
		{'in': '0xf', 'out': false},
		{'in': '0x12f', 'out': false},
		{'in': '0o8', 'out': false},
		{'in': '0o9', 'out': false},
		{'in': '0oa', 'out': false},
		{'in': '0o0', 'out': true},
		{'in': '0o1', 'out': true},
		{'in': '0o7', 'out': true},
		{'in': '0o71', 'out': true},
		{'in': '0o01', 'out': true},
		{'in': '-0o7', 'out': true},
		{'in': '-0o71', 'out': true},
		{'in': '-0o01', 'out': true},
	];
	testInOutPairs(cases, isOctalNumberLiteralStart, logger);
};