import { isNumberLiteral } from
'../../../../modules/parsing/kturtle/scanning/isNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsNumberLiteral(logger) {
	const cases = [
		{'in': 'x', 'out': false},
		{'in': '$x', 'out': false},
		{'in': '_', 'out': false},
		{'in': '-', 'out': false},
		{'in': '--1', 'out': false},
		{'in': '3.14.', 'out': false},
		{'in': '850@', 'out': false},
		{'in': '1', 'out': true},
		{'in': '-1', 'out': true},
		{'in': '123', 'out': true},
		{'in': '3.14', 'out': true},
		{'in': '-3.14', 'out': true},
		{'in': '90', 'out': true},
	];
	testInOutPairs(cases, isNumberLiteral, logger);
};