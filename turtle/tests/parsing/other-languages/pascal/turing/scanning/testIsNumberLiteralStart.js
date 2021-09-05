import { isNumberLiteralStart } from
'../../../../../../modules/parsing/other-languages/pascal/turing/scanning/isNumberLiteralStart.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testIsNumberLiteralStart(logger) {
	const cases = [
		{'in': '_', 'out': false},
		{'in': '-1.23..', 'out': false},
		{'in': '-1.23_', 'out': false},
		{'in': '-1.23,', 'out': false},
		{'in': '-1,', 'out': false},
		{'in': '3,', 'out': false},
		{'in': '-', 'out': true},
		{'in': '.', 'out': true},
		{'in': '0', 'out': true},
		{'in': '1', 'out': true},
		{'in': '-1', 'out': true},
		{'in': '-1.23', 'out': true}
	];
	testInOutPairs(cases, isNumberLiteralStart, logger);
};