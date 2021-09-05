import { isIdentifier } from
'../../../../modules/parsing/python-parsing/scanning/isIdentifier.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	const cases = [
		{'in': '1', 'out': false},
		{'in': '1.3', 'out': false},
		{'in': '1x', 'out': false},
		{'in': '1_', 'out': false},
		{'in': ':', 'out': false},
		{'in': ':x', 'out': false},
		{'in': '.', 'out': false},
		{'in': '(', 'out': false},
		{'in': ')', 'out': false},
		{'in': '[', 'out': false},
		{'in': '_', 'out': true},
		{'in': '_1', 'out': true},
		{'in': '_x', 'out': true},
		{'in': '__init__', 'out': true},
		{'in': 'X', 'out': true},
		{'in': 'x', 'out': true},
		{'in': 'a', 'out': true},
		{'in': 'xyz', 'out': true}
	];
	testInOutPairs(cases, isIdentifier, logger);
};