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
		{'in': '1.5E-2', 'out': true}, // copied from the initial value of variable DH in https://github.com/oonap0oo/QB64-projects/blob/main/linesani.bas
		{'in': '&010', 'out': true}, // octal
		{'in': '-3.14', 'out': true}
	];
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
};