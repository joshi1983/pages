import { isBinaryNumberLiteralStart } from
'../../../../modules/parsing/python-parsing/scanning/isBinaryNumberLiteralStart.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsBinaryNumberLiteralStart(logger) {
	const cases = [
		{'in': '0.', 'out': false},
		{'in': '0a', 'out': false},
		{'in': '0c', 'out': false},
		{'in': '0b', 'out': true},
		{'in': '0b0', 'out': true},
		{'in': '0b1', 'out': true},
		{'in': '-0b', 'out': true},
		{'in': '-0b0', 'out': true},
		{'in': '-0b1', 'out': true},
	];
	testInOutPairs(cases, isBinaryNumberLiteralStart, logger);
};