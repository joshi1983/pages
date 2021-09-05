import { isCompleteCharacterLiteral } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isCompleteCharacterLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsCompleteCharacterLiteral(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'f', 'out': false},
		{'in': '"f', 'out': false},
		{'in': '"f"', 'out': false},
		{'in': '\'f', 'out': false},
		{'in': '\'f\'', 'out': true},
		{'in': "'\\'", 'out': true}
	];
	testInOutPairs(cases, isCompleteCharacterLiteral, logger);
};