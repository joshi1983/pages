import { isIdentifier } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isIdentifier.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '3', 'out': false},
		{'in': '-', 'out': false},
		{'in': '+', 'out': false},
		{'in': '&', 'out': false},
		{'in': '%', 'out': false},
		{'in': '*', 'out': false},
		{'in': '/', 'out': false},

		// a few cases copied from: https://go.dev/ref/spec
		{'in': 'a', 'out': true},
		{'in': '_x9', 'out': true},
		{'in': 'ThisVariableIsExported', 'out': true},
		{'in': 'αβ', 'out': true}
	];
	testInOutPairs(cases, isIdentifier, logger);
};