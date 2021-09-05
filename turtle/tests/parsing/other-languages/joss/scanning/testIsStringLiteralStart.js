import { isStringLiteralStart } from
'../../../../../modules/parsing/other-languages/joss/scanning/isStringLiteralStart.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsStringLiteralStart(logger) {
	const cases = [
		{'in': '3', 'out': false},
		{'in': 'x', 'out': false},
		{'in': '$', 'out': false},
		{'in': '"', 'out': true},
		{'in': '"hi', 'out': true},
		{'in': '"hi.', 'out': true},
		{'in': '"hi."', 'out': false}, // complete string literal but not a start.
		{'in': '" L(%.0f,%.0f) =', 'out': true},
		{'in': '" L(%.0f,%.0f) ="', 'out': false},
	];
	testInOutPairs(cases, isStringLiteralStart, logger);
};