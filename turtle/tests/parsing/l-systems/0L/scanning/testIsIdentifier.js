import { isIdentifier } from
'../../../../../modules/parsing/l-systems/0L/scanning/isIdentifier.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsIdentifier(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '-', 'out': false},
		{'in': '-*', 'out': false},
		{'in': '-+', 'out': false},
		{'in': '+', 'out': false},
		{'in': '=', 'out': false},
		{'in': '->', 'out': false},
		{'in': 'a', 'out': true},
		{'in': 'A', 'out': true},
		{'in': 'F', 'out': true},
		{'in': 'X', 'out': true},
		{'in': 'ø', 'out': true},
	];
	testInOutPairs(cases, isIdentifier, logger);
};