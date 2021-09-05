import { isCompleteNumberLiteral } from
'../../../../../modules/parsing/basic/qbasic/scanning/isCompleteNumberLiteral.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsCompleteNumberLiteral(logger) {
	const cases = [
		{'in': '.', 'out': false},
		{'in': '+', 'out': false},
		{'in': '-', 'out': false},
		{'in': '*', 'out': false},
		{'in': '/', 'out': false},
		{'in': '&', 'out': false},
		{'in': '&o', 'out': false},
		{'in': '&O', 'out': false},
		{'in': '&h', 'out': false},
		{'in': '&H', 'out': false},
		{'in': '0', 'out': true},
		{'in': '1', 'out': true},
		{'in': '.1', 'out': true},
		{'in': '-.1', 'out': true},
		{'in': '-0.1', 'out': true},
		{'in': '0.1', 'out': true},
		{'in': '3.14', 'out': true},
		{'in': '&010', 'out': true}, // octal
		{'in': '-3.14', 'out': true}
	];
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
};