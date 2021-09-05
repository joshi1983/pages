import { isHexNumberLiteralStart } from
'../../../../modules/parsing/python-parsing/scanning/isHexNumberLiteralStart.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsHexNumberLiteralStart(logger) {
	const cases = [
		{'in': '0.', 'out': false},
		{'in': '0a', 'out': false},
		{'in': '0c', 'out': false},
		{'in': '0b', 'out': false},
		{'in': '0b0', 'out': false},
		{'in': '0b1', 'out': false},
		{'in': '0x1', 'out': true},
		{'in': '0x9', 'out': true},
		{'in': '0xa', 'out': true},
		{'in': '0xf', 'out': true},
		{'in': '0x12f', 'out': true},
		{'in': '-0x1', 'out': true},
		{'in': '-0x9', 'out': true},
		{'in': '-0xa', 'out': true},
		{'in': '-0xf', 'out': true},
		{'in': '-0x12f', 'out': true},
	];
	testInOutPairs(cases, isHexNumberLiteralStart, logger);
};