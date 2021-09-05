import { isCompleteNumberLiteral } from
'../../../../../modules/parsing/l-systems/0L/scanning/isCompleteNumberLiteral.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsCompleteNumberLiteral(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '.', 'out': false},
		{'in': '-.', 'out': false},
		{'in': '+', 'out': false},
		{'in': '+.', 'out': false},
		{'in': '-', 'out': false},
		{'in': '-*', 'out': false},
		{'in': '-+', 'out': false},
		{'in': '+', 'out': false},
		{'in': '4-', 'out': false},
		{'in': '=', 'out': false},
		{'in': '->', 'out': false},
		{'in': 'a', 'out': false},
		{'in': 'A', 'out': false},
		{'in': 'ø', 'out': false},
		{'in': '0', 'out': true},
		{'in': '1', 'out': true},
		{'in': '3.14', 'out': true},
		{'in': '0.', 'out': true},
		{'in': '-1.', 'out': true},
		{'in': '-1', 'out': true},
		{'in': '-1.3', 'out': true},
		{'in': '.12', 'out': true},
	];
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
};