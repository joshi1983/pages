import { isIdentifier } from
'../../../../../modules/parsing/other-languages/joss/scanning/isIdentifier.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	const cases = [
		{'in': '1', 'out': false},
		{'in': '90', 'out': false},
		{'in': '3.14', 'out': false},
		{'in': '-3.14', 'out': false},
		{'in': '1x', 'out': false},
		{'in': '$x', 'out': false},
		{'in': 'Type', 'out': true},
		{'in': 'Type ', 'out': false},
		{'in': 'x', 'out': true},
		{'in': 'A', 'out': true},
		{'in': 'x1', 'out': true},
		{'in': 'X', 'out': true},
		{'in': 'xyz', 'out': true},
		{'in': 'answer', 'out': true},
	];
	testInOutPairs(cases, isIdentifier, logger);
};