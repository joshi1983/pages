import { isNumberLiteral } from
'../../../../../modules/parsing/l-systems/0L/scanning/isNumberLiteral.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsNumberLiteral(logger) {
	const cases = [
		{'in': 'x', 'out': false},
		{'in': '.', 'out': false},
		{'in': '-', 'out': false},
		{'in': '-.', 'out': false},
		{'in': '-1', 'out': true},
		{'in': '-123', 'out': true},
		{'in': '-.23', 'out': true},
		{'in': '-123.', 'out': true},
		{'in': '-123.456', 'out': true},
		{'in': '1', 'out': true},
		{'in': '123', 'out': true},
		{'in': '.23', 'out': true},
		{'in': '123.456', 'out': true}
	];
	testInOutPairs(cases, isNumberLiteral, logger);
};