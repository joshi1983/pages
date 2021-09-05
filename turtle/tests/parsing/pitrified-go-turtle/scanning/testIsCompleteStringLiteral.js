import { isCompleteStringLiteral } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isCompleteStringLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsCompleteStringLiteral(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'f', 'out': false},
		{'in': '"f', 'out': false},
		{'in': '"f"', 'out': true},
		{'in': '"\\nf"', 'out': true},
		{'in': '\'f', 'out': false},
		{'in': '\'f\'', 'out': false},
		{'in': "'\\'", 'out': false}
	];
	testInOutPairs(cases, isCompleteStringLiteral, logger);
};