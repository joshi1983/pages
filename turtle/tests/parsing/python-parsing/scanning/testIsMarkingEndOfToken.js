import { isMarkingEndOfToken } from
'../../../../modules/parsing/python-parsing/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['x', 'y'], 'out': false},
		{'inArgs': [':', '='], 'out': false},
		{'inArgs': ['b', '"'], 'out': false}, // can be a start to a bytes literal like b"hello world"
		{'inArgs': ['@', 'y'], 'out': false},
		{'inArgs': ['@a', 'y'], 'out': false},
		{'inArgs': ['x', '='], 'out': true},
		{'inArgs': ['=', 'x'], 'out': true},
		{'inArgs': ['=', 'b'], 'out': true},
		{'inArgs': ['=', 'B'], 'out': true},
		{'inArgs': ['(', 'y'], 'out': true},
		{'inArgs': ['[', 'y'], 'out': true},
		{'inArgs': [':', 'y'], 'out': true},
		{'inArgs': [',', 'y'], 'out': true},
		{'inArgs': ['.', 'y'], 'out': true},
		{'inArgs': ['x', '.'], 'out': true},
		{'inArgs': ['2', ':'], 'out': true},
		{'inArgs': ['b"hi"', ':'], 'out': true},
		{'inArgs': ['b"hi"', ')'], 'out': true},
		{'inArgs': ['b"hi"', ']'], 'out': true},
		{'inArgs': ['b"hi"', ','], 'out': true},
		{'inArgs': ['\t', 'x'], 'out': true},
		{'inArgs': ['    ', 'x'], 'out': true},
		{'inArgs': [' ', 'x'], 'out': true},
		{'inArgs': [' ', '#'], 'out': true},
		{'inArgs': ['b"h', ':'], 'out': false},
		{'inArgs': ['b"h', 'i'], 'out': false},
		{'inArgs': ['b"h', '-'], 'out': false},
		{'inArgs': ['not', 'x'], 'out': false},
		{'inArgs': ['is', 'x'], 'out': false},
		{'inArgs': ['True', 'x'], 'out': false},
		{'inArgs': ['\\', '\n'], 'out': false}, // important for escaped line breaks
		{'inArgs': ['\\', '\r'], 'out': false},
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};