import { isValidIdentifier } from '../../../../modules/parsing/kturtle/scanning/isValidIdentifier.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsValidIdentifier(logger) {
	const cases = [
		{'in': '1', 'out': false},
		{'in': '90', 'out': false},
		{'in': '3.14', 'out': false},
		{'in': '-3.14', 'out': false},
		{'in': '1x', 'out': false},
		{'in': '$x', 'out': false},
		{'in': 'x', 'out': true},
		{'in': 'A', 'out': true},
		{'in': 'x1', 'out': true},
		{'in': 'X', 'out': true},
		{'in': 'xyz', 'out': true},
		{'in': 'answer', 'out': true},
		{'in': 'and_1_1', 'out': true},
		{'in': 'not_1', 'out': true}
	];
	testInOutPairs(cases, isValidIdentifier, logger);
};